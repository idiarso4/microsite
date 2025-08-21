import express from 'express'
import { prisma } from '../index'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = express.Router()

// Get all products with pagination and filtering
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined
    const status = req.query.status as string
    const search = req.query.search as string
    const lowStock = req.query.lowStock === 'true'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (status) {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (lowStock) {
      where.stock = {
        lte: prisma.product.fields.minStock
      }
    }

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          },
          stockMovements: {
            take: 5,
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      }),
      prisma.product.count({ where })
    ])

    // Get product statistics
    const stats = await prisma.product.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    const categoryStats = await prisma.product.groupBy({
      by: ['categoryId'],
      _count: {
        categoryId: true
      },
      _sum: {
        stock: true
      }
    })

    const totalValue = await prisma.product.aggregate({
      _sum: {
        stock: true
      },
      where: {
        status: 'active'
      }
    })

    const lowStockCount = await prisma.product.count({
      where: {
        stock: {
          lte: prisma.product.fields.minStock
        },
        status: 'active'
      }
    })

    res.json({
      products,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      stats: {
        byStatus: stats.reduce((acc, stat) => {
          acc[stat.status] = stat._count.status
          return acc
        }, {} as Record<string, number>),
        totalStock: totalValue._sum.stock || 0,
        lowStockCount,
        totalCount
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get products'
    })
  }
})

// Get single product by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const productId = parseInt(req.params.id)

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        stockMovements: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 20
        },
        orderItems: {
          include: {
            order: {
              select: {
                orderNumber: true,
                orderDate: true,
                status: true
              }
            }
          },
          take: 10,
          orderBy: {
            order: {
              orderDate: 'desc'
            }
          }
        }
      }
    })

    if (!product) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      })
    }

    res.json({ product })
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get product'
    })
  }
})

// Create new product
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const {
      name,
      sku,
      description,
      price,
      cost,
      stock = 0,
      minStock = 0,
      categoryId,
      status = 'active'
    } = req.body

    // Validation
    if (!name || !sku || !price || !cost || !categoryId) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name, SKU, price, cost, and category are required'
      })
    }

    // Check if SKU already exists
    const existingSku = await prisma.product.findUnique({
      where: { sku }
    })

    if (existingSku) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Product with this SKU already exists'
      })
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Category not found'
      })
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description,
        price: parseFloat(price),
        cost: parseFloat(cost),
        stock: parseInt(stock),
        minStock: parseInt(minStock),
        categoryId,
        status
      },
      include: {
        category: true
      }
    })

    // Create initial stock movement if stock > 0
    if (parseInt(stock) > 0) {
      await prisma.stockMovement.create({
        data: {
          type: 'in',
          quantity: parseInt(stock),
          reason: 'Initial stock',
          productId: product.id
        }
      })
    }

    res.status(201).json({
      message: 'Product created successfully',
      product
    })
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create product'
    })
  }
})

// Update product
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const productId = parseInt(req.params.id)
    const {
      name,
      sku,
      description,
      price,
      cost,
      minStock,
      categoryId,
      status
    } = req.body

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!existingProduct) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      })
    }

    // Check if SKU already exists (if changing SKU)
    if (sku && sku !== existingProduct.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku }
      })

      if (existingSku) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Product with this SKU already exists'
        })
      }
    }

    // Check if category exists (if changing category)
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      })

      if (!category) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Category not found'
        })
      }
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (sku !== undefined) updateData.sku = sku
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = parseFloat(price)
    if (cost !== undefined) updateData.cost = parseFloat(cost)
    if (minStock !== undefined) updateData.minStock = parseInt(minStock)
    if (categoryId !== undefined) updateData.categoryId = categoryId
    if (status !== undefined) updateData.status = status

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        category: true
      }
    })

    res.json({
      message: 'Product updated successfully',
      product
    })
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update product'
    })
  }
})

// Update product stock
router.put('/:id/stock', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const productId = parseInt(req.params.id)
    const { quantity, type, reason } = req.body

    if (!quantity || !type) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Quantity and type are required'
      })
    }

    if (!['in', 'out', 'adjustment'].includes(type)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Type must be in, out, or adjustment'
      })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      })
    }

    // Calculate new stock
    let newStock = product.stock
    const qty = parseInt(quantity)

    if (type === 'in') {
      newStock += qty
    } else if (type === 'out') {
      newStock -= qty
      if (newStock < 0) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Insufficient stock'
        })
      }
    } else if (type === 'adjustment') {
      newStock = qty
    }

    // Update product stock and create stock movement
    const [updatedProduct] = await Promise.all([
      prisma.product.update({
        where: { id: productId },
        data: { stock: newStock },
        include: {
          category: true
        }
      }),
      prisma.stockMovement.create({
        data: {
          type,
          quantity: type === 'adjustment' ? qty - product.stock : qty,
          reason: reason || `Stock ${type}`,
          productId
        }
      })
    ])

    res.json({
      message: 'Stock updated successfully',
      product: updatedProduct
    })
  } catch (error) {
    console.error('Update stock error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update stock'
    })
  }
})

// Delete product
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const productId = parseInt(req.params.id)

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!existingProduct) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      })
    }

    // Check if product has order items
    const orderItems = await prisma.orderItem.count({
      where: { productId }
    })

    if (orderItems > 0) {
      // Don't delete, just deactivate
      await prisma.product.update({
        where: { id: productId },
        data: { status: 'inactive' }
      })

      return res.json({
        message: 'Product deactivated successfully (has order history)'
      })
    }

    // Delete related stock movements first
    await prisma.stockMovement.deleteMany({
      where: { productId }
    })

    // Delete product
    await prisma.product.delete({
      where: { id: productId }
    })

    res.json({
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete product'
    })
  }
})

export default router

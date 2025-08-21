import express from 'express'
import { prisma } from '../index'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = express.Router()

// Get all orders with pagination and filtering
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const status = req.query.status as string
    const search = req.query.search as string

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customer: { name: { contains: search } } },
        { customer: { company: { contains: search } } }
      ]
    }

    // Get orders with pagination
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true
            }
          },
          createdBy: {
            select: {
              id: true,
              name: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true
                }
              }
            }
          }
        }
      }),
      prisma.order.count({ where })
    ])

    // Get order statistics
    const stats = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true
      },
      _sum: {
        totalAmount: true
      }
    })

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      stats: {
        byStatus: stats.reduce((acc, stat) => {
          acc[stat.status] = {
            count: stat._count.status,
            total: stat._sum.totalAmount || 0
          }
          return acc
        }, {} as Record<string, { count: number; total: number }>),
        totalCount
      }
    })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get orders'
    })
  }
})

// Get single order by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const orderId = parseInt(req.params.id)

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!order) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Order not found'
      })
    }

    res.json({ order })
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get order'
    })
  }
})

// Create new order
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { customerId, items, status = 'pending' } = req.body

    // Validation
    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Customer ID and items are required'
      })
    }

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    })

    if (!customer) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Customer not found'
      })
    }

    // Validate products and calculate total
    let totalAmount = 0
    const validatedItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `Product with ID ${item.productId} not found`
        })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `Insufficient stock for product ${product.name}`
        })
      }

      const itemTotal = product.price * item.quantity
      totalAmount += itemTotal

      validatedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      })
    }

    // Generate order number
    const orderCount = await prisma.order.count()
    const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        createdById: req.user!.id,
        totalAmount,
        status,
        items: {
          create: validatedItems
        }
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Update product stock if order is completed
    if (status === 'completed') {
      for (const item of validatedItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })

        // Create stock movement
        await prisma.stockMovement.create({
          data: {
            type: 'out',
            quantity: item.quantity,
            reason: `Order ${orderNumber}`,
            productId: item.productId
          }
        })
      }
    }

    res.status(201).json({
      message: 'Order created successfully',
      order
    })
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create order'
    })
  }
})

// Update order status
router.put('/:id/status', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const orderId = parseInt(req.params.id)
    const { status } = req.body

    if (!status) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Status is required'
      })
    }

    // Get current order
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true
      }
    })

    if (!currentOrder) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Order not found'
      })
    }

    // Update order status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Handle stock changes based on status change
    if (currentOrder.status !== 'completed' && status === 'completed') {
      // Deduct stock when order is completed
      for (const item of currentOrder.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })

        await prisma.stockMovement.create({
          data: {
            type: 'out',
            quantity: item.quantity,
            reason: `Order ${currentOrder.orderNumber} completed`,
            productId: item.productId
          }
        })
      }
    } else if (currentOrder.status === 'completed' && status === 'cancelled') {
      // Restore stock when completed order is cancelled
      for (const item of currentOrder.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        })

        await prisma.stockMovement.create({
          data: {
            type: 'in',
            quantity: item.quantity,
            reason: `Order ${currentOrder.orderNumber} cancelled`,
            productId: item.productId
          }
        })
      }
    }

    res.json({
      message: 'Order status updated successfully',
      order
    })
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update order status'
    })
  }
})

export default router

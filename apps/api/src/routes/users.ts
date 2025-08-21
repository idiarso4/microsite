import express from 'express'
import { prisma } from '../index'
import { authenticateToken, AuthRequest, requireAdmin } from '../middleware/auth'

const router = express.Router()

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const role = req.query.role as string
    const search = req.query.search as string

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (role) {
      where.role = role
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ]
    }

    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true,
              leads: true,
              activities: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    res.json({
      users,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get users'
    })
  }
})

// Get single user by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.id)

    // Users can only view their own profile unless they're admin
    if (req.user!.role !== 'admin' && req.user!.id !== userId) {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'You can only view your own profile'
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            status: true,
            orderDate: true
          }
        },
        leads: {
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            company: true,
            contactName: true,
            status: true,
            value: true
          }
        },
        activities: {
          take: 10,
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            type: true,
            description: true,
            createdAt: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get user'
    })
  }
})

// Update user (admin only for other users)
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.id)
    const { name, role, isActive } = req.body

    // Users can only update their own profile (limited fields) unless they're admin
    if (req.user!.role !== 'admin' && req.user!.id !== userId) {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'You can only update your own profile'
      })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      })
    }

    // Build update data based on user role
    const updateData: any = {}
    
    if (name !== undefined) {
      updateData.name = name
    }

    // Only admins can update role and isActive
    if (req.user!.role === 'admin') {
      if (role !== undefined) {
        updateData.role = role
      }
      if (isActive !== undefined) {
        updateData.isActive = isActive
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    res.json({
      message: 'User updated successfully',
      user
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update user'
    })
  }
})

// Deactivate user (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.id)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      })
    }

    // Don't allow admin to deactivate themselves
    if (userId === req.user!.id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'You cannot deactivate your own account'
      })
    }

    // Deactivate user instead of deleting
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false }
    })

    res.json({
      message: 'User deactivated successfully'
    })
  } catch (error) {
    console.error('Deactivate user error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to deactivate user'
    })
  }
})

export default router

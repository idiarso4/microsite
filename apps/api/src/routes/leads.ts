import express from 'express'
import { prisma } from '../index'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = express.Router()

// Get all leads with pagination and filtering
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const status = req.query.status as string
    const stage = req.query.stage as string
    const search = req.query.search as string

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (stage) {
      where.stage = stage
    }
    
    if (search) {
      where.OR = [
        { company: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get leads with pagination
    const [leads, totalCount] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          activities: {
            take: 3,
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      }),
      prisma.lead.count({ where })
    ])

    // Get lead statistics
    const stats = await prisma.lead.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    const stageStats = await prisma.lead.groupBy({
      by: ['stage'],
      _count: {
        stage: true
      }
    })

    const totalValue = await prisma.lead.aggregate({
      _sum: {
        value: true
      }
    })

    res.json({
      leads,
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
        byStage: stageStats.reduce((acc, stat) => {
          acc[stat.stage] = stat._count.stage
          return acc
        }, {} as Record<string, number>),
        totalValue: totalValue._sum.value || 0,
        totalCount
      }
    })
  } catch (error) {
    console.error('Get leads error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get leads'
    })
  }
})

// Get single lead by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const leadId = parseInt(req.params.id)

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        activities: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    if (!lead) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Lead not found'
      })
    }

    res.json({ lead })
  } catch (error) {
    console.error('Get lead error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get lead'
    })
  }
})

// Create new lead
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const {
      company,
      contactName,
      email,
      phone,
      status = 'cold',
      value,
      stage = 'qualification',
      assignedToId
    } = req.body

    // Validation
    if (!company || !contactName || !email || !value) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Company, contact name, email, and value are required'
      })
    }

    // Check if assigned user exists
    if (assignedToId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: assignedToId }
      })

      if (!assignedUser) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Assigned user not found'
        })
      }
    }

    const lead = await prisma.lead.create({
      data: {
        company,
        contactName,
        email,
        phone,
        status,
        value: parseFloat(value),
        stage,
        lastContact: new Date(),
        assignedToId: assignedToId || req.user!.id
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Create initial activity
    await prisma.activity.create({
      data: {
        type: 'note',
        description: `Lead created for ${company}`,
        userId: req.user!.id,
        leadId: lead.id
      }
    })

    res.status(201).json({
      message: 'Lead created successfully',
      lead
    })
  } catch (error) {
    console.error('Create lead error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create lead'
    })
  }
})

// Update lead
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const leadId = parseInt(req.params.id)
    const {
      company,
      contactName,
      email,
      phone,
      status,
      value,
      stage,
      assignedToId
    } = req.body

    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!existingLead) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Lead not found'
      })
    }

    // Check if assigned user exists
    if (assignedToId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: assignedToId }
      })

      if (!assignedUser) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Assigned user not found'
        })
      }
    }

    const updateData: any = {}
    if (company !== undefined) updateData.company = company
    if (contactName !== undefined) updateData.contactName = contactName
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (status !== undefined) updateData.status = status
    if (value !== undefined) updateData.value = parseFloat(value)
    if (stage !== undefined) updateData.stage = stage
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: updateData,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Create activity for update
    await prisma.activity.create({
      data: {
        type: 'note',
        description: `Lead updated by ${req.user!.name}`,
        userId: req.user!.id,
        leadId: lead.id
      }
    })

    res.json({
      message: 'Lead updated successfully',
      lead
    })
  } catch (error) {
    console.error('Update lead error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update lead'
    })
  }
})

// Delete lead
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const leadId = parseInt(req.params.id)

    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!existingLead) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Lead not found'
      })
    }

    // Delete related activities first
    await prisma.activity.deleteMany({
      where: { leadId }
    })

    // Delete lead
    await prisma.lead.delete({
      where: { id: leadId }
    })

    res.json({
      message: 'Lead deleted successfully'
    })
  } catch (error) {
    console.error('Delete lead error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete lead'
    })
  }
})

// Add activity to lead
router.post('/:id/activities', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const leadId = parseInt(req.params.id)
    const { type, description } = req.body

    if (!type || !description) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Type and description are required'
      })
    }

    // Check if lead exists
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!lead) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Lead not found'
      })
    }

    const activity = await prisma.activity.create({
      data: {
        type,
        description,
        userId: req.user!.id,
        leadId
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    // Update lead's last contact date
    await prisma.lead.update({
      where: { id: leadId },
      data: { lastContact: new Date() }
    })

    res.status(201).json({
      message: 'Activity added successfully',
      activity
    })
  } catch (error) {
    console.error('Add activity error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add activity'
    })
  }
})

export default router

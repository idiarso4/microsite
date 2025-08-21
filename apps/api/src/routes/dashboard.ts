import express from 'express'
import { prisma } from '../index'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = express.Router()

// Get dashboard overview statistics
router.get('/overview', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Get current date for filtering
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get total revenue (current month)
    const currentMonthOrders = await prisma.order.aggregate({
      where: {
        orderDate: {
          gte: startOfMonth
        },
        status: 'completed'
      },
      _sum: {
        totalAmount: true
      },
      _count: true
    })

    // Get last month revenue for comparison
    const lastMonthOrders = await prisma.order.aggregate({
      where: {
        orderDate: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        },
        status: 'completed'
      },
      _sum: {
        totalAmount: true
      }
    })

    // Calculate revenue change percentage
    const currentRevenue = currentMonthOrders._sum.totalAmount || 0
    const lastRevenue = lastMonthOrders._sum.totalAmount || 0
    const revenueChange = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0

    // Get active users count
    const activeUsers = await prisma.user.count({
      where: {
        isActive: true
      }
    })

    // Get total users last month for comparison
    const lastMonthUsers = await prisma.user.count({
      where: {
        createdAt: {
          lt: startOfMonth
        },
        isActive: true
      }
    })

    const userChange = lastMonthUsers > 0 ? ((activeUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0

    // Get total orders this month
    const totalOrders = currentMonthOrders._count

    // Get orders last month for comparison
    const lastMonthOrderCount = await prisma.order.count({
      where: {
        orderDate: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      }
    })

    const orderChange = lastMonthOrderCount > 0 ? ((totalOrders - lastMonthOrderCount) / lastMonthOrderCount) * 100 : 0

    // Get inventory items count
    const inventoryCount = await prisma.product.count({
      where: {
        status: 'active'
      }
    })

    // Get low stock items
    const lowStockItems = await prisma.product.count({
      where: {
        stock: {
          lte: prisma.product.fields.minStock
        },
        status: 'active'
      }
    })

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        customer: {
          select: {
            name: true,
            company: true
          }
        }
      }
    })

    // Get recent activities
    const recentActivities = await prisma.activity.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        lead: {
          select: {
            company: true
          }
        }
      }
    })

    // Format response
    const stats = {
      revenue: {
        current: currentRevenue,
        change: revenueChange,
        trend: revenueChange >= 0 ? 'up' : 'down'
      },
      users: {
        current: activeUsers,
        change: userChange,
        trend: userChange >= 0 ? 'up' : 'down'
      },
      orders: {
        current: totalOrders,
        change: orderChange,
        trend: orderChange >= 0 ? 'up' : 'down'
      },
      inventory: {
        current: inventoryCount,
        lowStock: lowStockItems,
        change: 0, // Could calculate based on new products added
        trend: 'up'
      }
    }

    res.json({
      stats,
      recentOrders: recentOrders.map(order => ({
        id: order.orderNumber,
        customer: order.customer.company || order.customer.name,
        amount: order.totalAmount,
        status: order.status,
        date: order.orderDate.toISOString().split('T')[0]
      })),
      recentActivities: recentActivities.map(activity => ({
        type: activity.type,
        message: activity.description,
        time: getTimeAgo(activity.createdAt),
        user: activity.user.name,
        lead: activity.lead?.company
      }))
    })
  } catch (error) {
    console.error('Dashboard overview error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get dashboard overview'
    })
  }
})

// Get sales performance data
router.get('/sales-performance', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    // Get monthly sales data for the current year
    const monthlySales = await prisma.order.groupBy({
      by: ['orderDate'],
      where: {
        orderDate: {
          gte: startOfYear
        },
        status: 'completed'
      },
      _sum: {
        totalAmount: true
      },
      _count: true
    })

    // Process monthly data
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(now.getFullYear(), i, 1)
      const monthName = month.toLocaleDateString('en-US', { month: 'short' })
      
      const monthSales = monthlySales.filter(sale => {
        const saleMonth = new Date(sale.orderDate).getMonth()
        return saleMonth === i
      })

      const totalRevenue = monthSales.reduce((sum, sale) => sum + (sale._sum.totalAmount || 0), 0)
      const totalOrders = monthSales.reduce((sum, sale) => sum + sale._count, 0)

      return {
        month: monthName,
        revenue: totalRevenue,
        orders: totalOrders
      }
    })

    res.json({
      monthlyData,
      totalYearRevenue: monthlyData.reduce((sum, month) => sum + month.revenue, 0),
      totalYearOrders: monthlyData.reduce((sum, month) => sum + month.orders, 0)
    })
  } catch (error) {
    console.error('Sales performance error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get sales performance data'
    })
  }
})

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) {
    return 'Just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  } else {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }
}

export default router

import { apiService } from './api'

export interface DashboardStats {
  revenue: {
    current: number
    change: number
    trend: 'up' | 'down'
  }
  orders: {
    current: number
    change: number
    trend: 'up' | 'down'
  }
  customers: {
    current: number
    change: number
    trend: 'up' | 'down'
  }
  inventory: {
    current: number
    change: number
    trend: 'up' | 'down'
    lowStock?: number
  }
}

export interface DashboardActivity {
  id: number
  type: string
  message: string
  time: string
  icon?: React.ReactNode
  user?: string
  lead?: string
}

export interface DashboardAlert {
  id: number
  type: 'warning' | 'info' | 'success' | 'error'
  message: string
  priority: 'high' | 'medium' | 'low'
}

export interface RecentOrder {
  id: string
  customer: string
  amount: number | string
  status: string
  date: string
}

export interface DashboardOverview {
  stats: DashboardStats
  recentOrders: RecentOrder[]
  recentActivities: DashboardActivity[]
}

export interface SalesPerformance {
  monthlyData: Array<{
    month: string
    revenue: number
    orders: number
  }>
  totalYearRevenue: number
  totalYearOrders: number
}

class DashboardService {
  async getOverview(): Promise<DashboardOverview> {
    try {
      const response = await apiService.getDashboardOverview()
      return response
    } catch (error) {
      console.error('Failed to fetch dashboard overview:', error)
      // Return fallback mock data if API fails
      return this.getMockOverview()
    }
  }

  async getSalesPerformance(): Promise<SalesPerformance> {
    try {
      const response = await apiService.getDashboardSalesPerformance()
      return response
    } catch (error) {
      console.error('Failed to fetch sales performance:', error)
      // Return fallback mock data if API fails
      return this.getMockSalesPerformance()
    }
  }

  async getActivities(): Promise<DashboardActivity[]> {
    try {
      const response = await apiService.getDashboardActivities()
      return response
    } catch (error) {
      console.error('Failed to fetch dashboard activities:', error)
      // Return fallback mock data if API fails
      return this.getMockActivities()
    }
  }

  // Fallback mock data methods
  private getMockOverview(): DashboardOverview {
    return {
      stats: {
        revenue: { current: 15750000, change: 12.5, trend: 'up' },
        orders: { current: 156, change: 8.3, trend: 'up' },
        customers: { current: 89, change: -2.1, trend: 'down' },
        inventory: { current: 1247, change: 5.7, trend: 'up' }
      },
      recentOrders: [
        { id: 'ORD-001', customer: 'PT. ABC Corp', amount: 2500000, status: 'completed', date: '2025-01-25' },
        { id: 'ORD-002', customer: 'CV. XYZ Ltd', amount: 1750000, status: 'pending', date: '2025-01-24' },
        { id: 'ORD-003', customer: 'PT. DEF Inc', amount: 3200000, status: 'processing', date: '2025-01-24' },
        { id: 'ORD-004', customer: 'UD. GHI', amount: 890000, status: 'completed', date: '2025-01-23' },
        { id: 'ORD-005', customer: 'PT. JKL Group', amount: 4100000, status: 'shipped', date: '2025-01-23' }
      ],
      recentActivities: [
        { id: 1, type: 'order', message: 'New order #ORD-001 received', time: '5 min ago' },
        { id: 2, type: 'payment', message: 'Payment of Rp 2.5M received', time: '15 min ago' },
        { id: 3, type: 'inventory', message: 'Low stock alert for Product A', time: '1 hour ago' },
        { id: 4, type: 'user', message: 'New user registered', time: '2 hours ago' }
      ]
    }
  }

  private getMockSalesPerformance(): SalesPerformance {
    return {
      monthlyData: [
        { month: 'Jan', revenue: 12500000, orders: 45 },
        { month: 'Feb', revenue: 15750000, orders: 52 },
        { month: 'Mar', revenue: 18200000, orders: 61 },
        { month: 'Apr', revenue: 16800000, orders: 58 },
        { month: 'May', revenue: 21300000, orders: 67 },
        { month: 'Jun', revenue: 19500000, orders: 63 },
        { month: 'Jul', revenue: 22100000, orders: 71 },
        { month: 'Aug', revenue: 20800000, orders: 68 },
        { month: 'Sep', revenue: 24500000, orders: 75 },
        { month: 'Oct', revenue: 23200000, orders: 72 },
        { month: 'Nov', revenue: 26800000, orders: 81 },
        { month: 'Dec', revenue: 25400000, orders: 78 }
      ],
      totalYearRevenue: 246850000,
      totalYearOrders: 791
    }
  }

  private getMockActivities(): DashboardActivity[] {
    return [
      { id: 1, type: 'order', message: 'New order #ORD-001 received', time: '5 min ago' },
      { id: 2, type: 'payment', message: 'Payment of Rp 2.5M received', time: '15 min ago' },
      { id: 3, type: 'inventory', message: 'Low stock alert for Product A', time: '1 hour ago' },
      { id: 4, type: 'user', message: 'New user registered', time: '2 hours ago' },
      { id: 5, type: 'lead', message: 'New lead from website contact form', time: '3 hours ago' },
      { id: 6, type: 'invoice', message: 'Invoice #INV-001 generated', time: '4 hours ago' }
    ]
  }

  // Generate alerts based on dashboard data
  generateAlerts(stats: DashboardStats): DashboardAlert[] {
    const alerts: DashboardAlert[] = []

    // Low stock alert
    if (stats?.inventory?.lowStock && stats.inventory.lowStock > 0) {
      alerts.push({
        id: 1,
        type: 'warning',
        message: `${stats.inventory.lowStock} products are running low on stock`,
        priority: 'high'
      })
    }

    // Revenue trend alert
    if (stats.revenue.trend === 'down' && Math.abs(stats.revenue.change) > 10) {
      alerts.push({
        id: 2,
        type: 'warning',
        message: `Revenue decreased by ${Math.abs(stats.revenue.change).toFixed(1)}% this month`,
        priority: 'high'
      })
    }

    // Orders trend alert
    if (stats.orders.trend === 'up' && stats.orders.change > 15) {
      alerts.push({
        id: 3,
        type: 'success',
        message: `Orders increased by ${stats.orders.change.toFixed(1)}% this month`,
        priority: 'medium'
      })
    }

    // Default alerts if none generated
    if (alerts.length === 0) {
      alerts.push(
        {
          id: 1,
          type: 'info',
          message: 'Monthly report is ready for review',
          priority: 'medium'
        },
        {
          id: 2,
          type: 'success',
          message: 'Backup completed successfully',
          priority: 'low'
        }
      )
    }

    return alerts
  }
}

export const dashboardService = new DashboardService()

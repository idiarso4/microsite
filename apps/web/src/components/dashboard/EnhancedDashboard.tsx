import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondary,
  Divider,
  CircularProgress,
  Stack
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  MonetizationOn,
  People,
  Inventory,
  ShoppingCart,
  Assessment,
  Warning,
  CheckCircle,
  Schedule,
  MoreVert,
  Refresh,
  Notifications,
  Business,
  LocalShipping,
  AccountBalance
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { usePermissions } from '../../hooks/usePermissions'
import PermissionGuard from '../auth/PermissionGuard'

// Mock data for demonstration
const mockDashboardData = {
  stats: {
    revenue: { current: 15750000, change: 12.5, trend: 'up' },
    orders: { current: 156, change: 8.3, trend: 'up' },
    customers: { current: 89, change: -2.1, trend: 'down' },
    inventory: { current: 1247, change: 5.7, trend: 'up' }
  },
  recentActivities: [
    { id: 1, type: 'order', message: 'New order #ORD-001 received', time: '5 min ago', icon: <ShoppingCart /> },
    { id: 2, type: 'payment', message: 'Payment of Rp 2.5M received', time: '15 min ago', icon: <MonetizationOn /> },
    { id: 3, type: 'inventory', message: 'Low stock alert for Product A', time: '1 hour ago', icon: <Warning /> },
    { id: 4, type: 'user', message: 'New user registered', time: '2 hours ago', icon: <People /> }
  ],
  quickActions: [
    { title: 'Create Invoice', icon: <AccountBalance />, action: 'invoice', color: '#DC143C' },
    { title: 'Add Product', icon: <Inventory />, action: 'product', color: '#1A1A1A' },
    { title: 'New Customer', icon: <People />, action: 'customer', color: '#4CAF50' },
    { title: 'Generate Report', icon: <Assessment />, action: 'report', color: '#FF9800' }
  ],
  alerts: [
    { id: 1, type: 'warning', message: '5 products are running low on stock', priority: 'high' },
    { id: 2, type: 'info', message: 'Monthly report is ready for review', priority: 'medium' },
    { id: 3, type: 'success', message: 'Backup completed successfully', priority: 'low' }
  ]
}

interface StatCardProps {
  title: string
  value: string
  change: number
  trend: 'up' | 'down'
  icon: React.ReactNode
  color: string
  onClick?: () => void
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon, color, onClick }) => {
  return (
    <Card
      sx={{
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        border: `1px solid ${color}20`,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${color}20`
        } : {},
        transition: 'all 0.3s ease'
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color }}>
              {value}
            </Typography>
            <Box display="flex" alignItems="center" mt={1}>
              {trend === 'up' ? (
                <TrendingUp sx={{ color: '#4CAF50', fontSize: 16, mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ color: '#f44336', fontSize: 16, mr: 0.5 }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: trend === 'up' ? '#4CAF50' : '#f44336',
                  fontWeight: 'medium'
                }}
              >
                {change > 0 ? '+' : ''}{change}%
              </Typography>
            </Box>
          </Box>
          <Avatar
            sx={{
              backgroundColor: `${color}15`,
              color,
              width: 56,
              height: 56
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function EnhancedDashboard() {
  const { user, isDemoMode } = useAuth()
  const { canAccessModule, getAccessibleModules } = usePermissions()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`)
    // Navigate to appropriate page based on action
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: '#DC143C' }} />
      </Box>
    )
  }

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `Rp ${mockDashboardData.stats.revenue.current.toLocaleString()}`,
      change: mockDashboardData.stats.revenue.change,
      trend: mockDashboardData.stats.revenue.trend as 'up' | 'down',
      icon: <MonetizationOn />,
      color: '#DC143C',
      onClick: () => canAccessModule('accounting') && console.log('Navigate to accounting')
    },
    {
      title: 'Orders',
      value: mockDashboardData.stats.orders.current.toString(),
      change: mockDashboardData.stats.orders.change,
      trend: mockDashboardData.stats.orders.trend as 'up' | 'down',
      icon: <ShoppingCart />,
      color: '#1A1A1A',
      onClick: () => canAccessModule('crm') && console.log('Navigate to orders')
    },
    {
      title: 'Customers',
      value: mockDashboardData.stats.customers.current.toString(),
      change: mockDashboardData.stats.customers.change,
      trend: mockDashboardData.stats.customers.trend as 'up' | 'down',
      icon: <People />,
      color: '#4CAF50',
      onClick: () => canAccessModule('crm') && console.log('Navigate to customers')
    },
    {
      title: 'Inventory Items',
      value: mockDashboardData.stats.inventory.current.toString(),
      change: mockDashboardData.stats.inventory.change,
      trend: mockDashboardData.stats.inventory.trend as 'up' | 'down',
      icon: <Inventory />,
      color: '#FF9800',
      onClick: () => canAccessModule('inventory') && console.log('Navigate to inventory')
    }
  ]

  return (
    <Box>
      {/* Welcome Header */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
            Selamat Datang, {user?.name || 'User'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Berikut adalah ringkasan aktivitas bisnis Anda hari ini
          </Typography>
          {isDemoMode && (
            <Chip
              label="Demo Mode"
              color="info"
              size="small"
              sx={{ mt: 1 }}
            />
          )}
        </Box>
        <Button
          variant="outlined"
          startIcon={refreshing ? <CircularProgress size={16} /> : <Refresh />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <PermissionGuard showFallback={false}>
              <StatCard {...stat} />
            </PermissionGuard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {mockDashboardData.quickActions.map((action, index) => (
                  <Grid item xs={6} key={index}>
                    <PermissionGuard showFallback={false}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={action.icon}
                        onClick={() => handleQuickAction(action.action)}
                        sx={{
                          py: 2,
                          borderColor: action.color,
                          color: action.color,
                          '&:hover': {
                            borderColor: action.color,
                            backgroundColor: `${action.color}10`
                          }
                        }}
                      >
                        {action.title}
                      </Button>
                    </PermissionGuard>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Recent Activities
              </Typography>
              <List dense>
                {mockDashboardData.recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#DC143C' }}>
                          {activity.icon}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.message}
                        secondary={activity.time}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                    {index < mockDashboardData.recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts & Notifications */}
        <Grid item xs={12} md={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Alerts & Notifications
              </Typography>
              <Stack spacing={2}>
                {mockDashboardData.alerts.map((alert) => (
                  <Alert
                    key={alert.id}
                    severity={alert.type as any}
                    variant="outlined"
                    sx={{ fontSize: '0.875rem' }}
                  >
                    {alert.message}
                  </Alert>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

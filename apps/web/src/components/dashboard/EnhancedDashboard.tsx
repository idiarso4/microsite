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
import { dashboardService, DashboardOverview, DashboardAlert } from '../../services/dashboard'
import { useDashboardUpdates, useNotifications, useUserActivity } from '../../hooks/useWebSocket'

// Quick actions configuration
const quickActions = [
  { title: 'Create Invoice', icon: <AccountBalance />, action: 'invoice', color: '#DC143C' },
  { title: 'Add Product', icon: <Inventory />, action: 'product', color: '#1A1A1A' },
  { title: 'New Customer', icon: <People />, action: 'customer', color: '#4CAF50' },
  { title: 'Generate Report', icon: <Assessment />, action: 'report', color: '#FF9800' }
]

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
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null)
  const [alerts, setAlerts] = useState<DashboardAlert[]>([])
  const [error, setError] = useState<string | null>(null)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())

  // Real-time updates
  const { notifications, unreadCount } = useNotifications()
  const { trackActivity } = useUserActivity()

  const loadDashboardData = async () => {
    try {
      setError(null)
      const data = await dashboardService.getOverview()
      setDashboardData(data)
      setLastUpdateTime(new Date())

      // Generate alerts based on the data
      const generatedAlerts = dashboardService.generateAlerts(data.stats)
      setAlerts(generatedAlerts)

      // Track user activity
      trackActivity('dashboard_view', { timestamp: new Date().toISOString() })
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Real-time dashboard updates
  useDashboardUpdates((updatedData) => {
    console.log('Received real-time dashboard update:', updatedData)
    setDashboardData(prev => ({
      ...prev,
      ...updatedData
    }))
    setLastUpdateTime(new Date())

    // Update alerts if stats changed
    if (updatedData.stats) {
      const generatedAlerts = dashboardService.generateAlerts(updatedData.stats)
      setAlerts(generatedAlerts)
    }
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
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

  const statsCards = dashboardData ? [
    {
      title: 'Total Revenue',
      value: `Rp ${(dashboardData?.stats?.revenue?.current || 0).toLocaleString()}`,
      change: dashboardData?.stats?.revenue?.change || 0,
      trend: (dashboardData?.stats?.revenue?.trend || 'up') as 'up' | 'down',
      icon: <MonetizationOn />,
      color: '#DC143C',
      onClick: () => canAccessModule('accounting') && console.log('Navigate to accounting')
    },
    {
      title: 'Orders',
      value: (dashboardData?.stats?.orders?.current || 0).toString(),
      change: dashboardData?.stats?.orders?.change || 0,
      trend: (dashboardData?.stats?.orders?.trend || 'up') as 'up' | 'down',
      icon: <ShoppingCart />,
      color: '#1A1A1A',
      onClick: () => canAccessModule('crm') && console.log('Navigate to orders')
    },
    {
      title: 'Customers',
      value: (dashboardData?.stats?.customers?.current || 0).toString(),
      change: dashboardData?.stats?.customers?.change || 0,
      trend: (dashboardData?.stats?.customers?.trend || 'up') as 'up' | 'down',
      icon: <People />,
      color: '#4CAF50',
      onClick: () => canAccessModule('crm') && console.log('Navigate to customers')
    },
    {
      title: 'Inventory Items',
      value: (dashboardData?.stats?.inventory?.current || 0).toString(),
      change: dashboardData?.stats?.inventory?.change || 0,
      trend: (dashboardData?.stats?.inventory?.trend || 'up') as 'up' | 'down',
      icon: <Inventory />,
      color: '#FF9800',
      onClick: () => canAccessModule('inventory') && console.log('Navigate to inventory')
    }
  ] : []

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={40} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading dashboard...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          Retry
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      {/* CSS Animation for pulse effect */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Real-time indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#4CAF50',
                animation: 'pulse 2s infinite'
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Live • Updated {lastUpdateTime.toLocaleTimeString()}
            </Typography>
          </Box>

          {/* Notifications */}
          {unreadCount > 0 && (
            <Chip
              icon={<Notifications />}
              label={`${unreadCount} new`}
              color="primary"
              size="small"
              variant="outlined"
            />
          )}

          <Button
            variant="outlined"
            startIcon={refreshing ? <CircularProgress size={16} /> : <Refresh />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            Refresh
          </Button>
        </Box>
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
                {quickActions.map((action, index) => (
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
                {/* Real-time notifications first */}
                {notifications.slice(0, 3).map((notification, index) => (
                  <React.Fragment key={`notif-${notification.id || index}`}>
                    <ListItem sx={{ bgcolor: notification.read ? 'transparent' : 'action.hover' }}>
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#4CAF50' }}>
                          <Notifications />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={notification.message || notification.title}
                        secondary={`Just now • ${notification.type || 'System'}`}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: notification.read ? 'normal' : 'bold' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}

                {/* Regular activities */}
                {(dashboardData?.recentActivities || []).slice(0, notifications.length > 0 ? 4 : 7).map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#DC143C' }}>
                          {activity.type === 'order' && <ShoppingCart />}
                          {activity.type === 'payment' && <MonetizationOn />}
                          {activity.type === 'inventory' && <Warning />}
                          {activity.type === 'user' && <People />}
                          {activity.type === 'lead' && <People />}
                          {activity.type === 'invoice' && <AccountBalance />}
                          {!['order', 'payment', 'inventory', 'user', 'lead', 'invoice'].includes(activity.type) && <Notifications />}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.message}
                        secondary={activity.time}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                    {index < (dashboardData?.recentActivities || []).slice(0, notifications.length > 0 ? 4 : 7).length - 1 && <Divider />}
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
                {alerts.map((alert) => (
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

import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  People,
  ShoppingCart,
  MonetizationOn,
  Inventory,
  Assignment,
  Warning,
  CheckCircle,
  Schedule
} from '@mui/icons-material'
import { apiService } from '../../services/api'

const activities = [
  { type: 'order', message: 'New order from PT Maju Bersama', time: '2 minutes ago', icon: <ShoppingCart /> },
  { type: 'user', message: 'New user registration', time: '15 minutes ago', icon: <People /> },
  { type: 'inventory', message: 'Low stock alert for Product A', time: '1 hour ago', icon: <Warning /> },
  { type: 'task', message: 'Monthly report generated', time: '2 hours ago', icon: <Assignment /> }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return '#4CAF50'
    case 'pending': return '#FF9800'
    case 'processing': return '#2196F3'
    default: return '#757575'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle />
    case 'pending': return <Schedule />
    case 'processing': return <TrendingUp />
    default: return <Warning />
  }
}

export default function DashboardOverview() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const data = await apiService.getDashboardOverview()
        setDashboardData(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: '#DC143C' }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please try refreshing the page
        </Typography>
      </Box>
    )
  }

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `Rp ${(dashboardData?.stats?.revenue?.current || 0).toLocaleString()}`,
      change: `${dashboardData?.stats?.revenue?.change || 0}%`,
      trend: dashboardData?.stats?.revenue?.trend || 'up',
      icon: <MonetizationOn />,
      color: '#DC143C'
    },
    {
      title: 'Active Users',
      value: dashboardData?.stats?.users?.current?.toString() || '0',
      change: `${dashboardData?.stats?.users?.change || 0}%`,
      trend: dashboardData?.stats?.users?.trend || 'up',
      icon: <People />,
      color: '#1A1A1A'
    },
    {
      title: 'Orders',
      value: dashboardData?.stats?.orders?.current?.toString() || '0',
      change: `${dashboardData?.stats?.orders?.change || 0}%`,
      trend: dashboardData?.stats?.orders?.trend || 'up',
      icon: <ShoppingCart />,
      color: '#DC143C'
    },
    {
      title: 'Inventory Items',
      value: dashboardData?.stats?.inventory?.current?.toString() || '0',
      change: `${dashboardData?.stats?.inventory?.change || 0}%`,
      trend: dashboardData?.stats?.inventory?.trend || 'up',
      icon: <Inventory />,
      color: '#1A1A1A'
    }
  ]

  return (
    <Box>
      {/* Welcome Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
          Selamat Datang, Admin! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Berikut adalah ringkasan aktivitas bisnis Anda hari ini
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                border: `1px solid ${stat.color}20`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${stat.color}20`
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      {stat.trend === 'up' ? (
                        <TrendingUp sx={{ color: '#4CAF50', fontSize: 16, mr: 0.5 }} />
                      ) : (
                        <TrendingDown sx={{ color: '#f44336', fontSize: 16, mr: 0.5 }} />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color: stat.trend === 'up' ? '#4CAF50' : '#f44336',
                          fontWeight: 'medium'
                        }}
                      >
                        {stat.change}
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar
                    sx={{
                      backgroundColor: `${stat.color}15`,
                      color: stat.color,
                      width: 56,
                      height: 56
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Pesanan Terbaru
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(dashboardData?.recentOrders || []).map((order: any) => (
                    <TableRow key={order.id} hover>
                      <TableCell sx={{ fontWeight: 'medium' }}>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>{order.amount}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(order.status)}
                          label={order.status}
                          size="small"
                          sx={{
                            backgroundColor: `${getStatusColor(order.status)}15`,
                            color: getStatusColor(order.status),
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Aktivitas Terbaru
            </Typography>
            <List>
              {activities.map((activity, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        backgroundColor: activity.priority === 'high' ? '#DC143C15' :
                                        activity.priority === 'medium' ? '#FF980015' : '#4CAF5015',
                        color: activity.priority === 'high' ? '#DC143C' :
                               activity.priority === 'medium' ? '#FF9800' : '#4CAF50',
                        width: 40,
                        height: 40
                      }}
                    >
                      {activity.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {activity.message}
                        </Typography>
                        {activity.priority === 'high' && (
                          <Badge color="error" variant="dot" />
                        )}
                      </Box>
                    }
                    secondary={activity.time}
                    primaryTypographyProps={{
                      fontSize: '0.875rem'
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Tasks */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Upcoming Tasks
            </Typography>
            <List>
              {upcomingTasks.map((task, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                          {task.title}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            label={task.priority}
                            size="small"
                            sx={{
                              backgroundColor: task.priority === 'high' ? '#DC143C15' :
                                             task.priority === 'medium' ? '#FF980015' : '#4CAF5015',
                              color: task.priority === 'high' ? '#DC143C' :
                                     task.priority === 'medium' ? '#FF9800' : '#4CAF50',
                              fontSize: '0.7rem',
                              height: 20
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Due: {task.due}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        Assigned to: {task.assignee}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Performance Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Sales Target
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
                      75%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      of Rp 3.2M
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#DC143C20',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#DC143C'
                      }
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Customer Satisfaction
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
                      92%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      satisfaction rate
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={92}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#1A1A1A20',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#1A1A1A'
                      }
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Inventory Turnover
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
                      68%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      efficiency rate
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={68}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#DC143C20',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#DC143C'
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Analytics,
  Assessment,
  ShowChart,
  Timeline,
  Insights,
  Speed,
  AttachMoney,
  People,
  Inventory,
  ShoppingCart,
  LocalShipping,
  Business,
  Refresh,
  Dashboard,
  DataUsage,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TableChart,
  FilterList,
  DateRange,
  CloudDownload
} from '@mui/icons-material'
import { apiService } from '../../services/api'

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedPeriod])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const [
        financeData,
        ordersData,
        inventoryData,
        hrData,
        purchasesData,
        leadsData
      ] = await Promise.all([
        apiService.getFinanceOverview(),
        apiService.getOrders({ limit: 100 }),
        apiService.getProducts({ limit: 100 }),
        apiService.getEmployees({ limit: 100 }),
        apiService.getPurchases({ limit: 100 }),
        apiService.getLeads({ limit: 100 })
      ])

      // Calculate analytics metrics
      const totalRevenue = financeData.totalRevenue || 0
      const totalOrders = ordersData.pagination?.total || 0
      const totalProducts = inventoryData.pagination?.total || 0
      const totalEmployees = hrData.pagination?.total || 0
      const totalPurchases = purchasesData.pagination?.total || 0
      const totalLeads = leadsData.pagination?.total || 0

      // Calculate growth rates (mock data for demo)
      const revenueGrowth = 15.2
      const ordersGrowth = 8.7
      const employeeGrowth = 3.4
      const leadsGrowth = 12.1

      // Top performing metrics
      const topProducts = inventoryData.products?.sort((a: any, b: any) =>
        (b.stock * b.price) - (a.stock * a.price)).slice(0, 5) || []

      const recentOrders = ordersData.orders?.slice(0, 5) || []

      // Generate revenue trend data (mock monthly data)
      const revenueData = [
        { month: 'Jan', revenue: 45000000, orders: 120, target: 50000000 },
        { month: 'Feb', revenue: 52000000, orders: 135, target: 50000000 },
        { month: 'Mar', revenue: 48000000, orders: 128, target: 50000000 },
        { month: 'Apr', revenue: 61000000, orders: 142, target: 55000000 },
        { month: 'May', revenue: 55000000, orders: 138, target: 55000000 },
        { month: 'Jun', revenue: 67000000, orders: 156, target: 60000000 },
        { month: 'Jul', revenue: 72000000, orders: 168, target: 65000000 },
        { month: 'Aug', revenue: totalRevenue, orders: totalOrders, target: 70000000 }
      ]

      // Generate sales distribution data
      const salesDistribution = [
        { name: 'Electronics', value: 35, amount: totalRevenue * 0.35, color: '#DC143C' },
        { name: 'Office Supplies', value: 25, amount: totalRevenue * 0.25, color: '#4CAF50' },
        { name: 'Furniture', value: 20, amount: totalRevenue * 0.20, color: '#2196F3' },
        { name: 'Software', value: 15, amount: totalRevenue * 0.15, color: '#FF9800' },
        { name: 'Others', value: 5, amount: totalRevenue * 0.05, color: '#9C27B0' }
      ]

      // Department performance data
      const departmentData = [
        { department: 'Sales', performance: 92, target: 90, employees: Math.floor(totalEmployees * 0.3) },
        { department: 'IT', performance: 88, target: 85, employees: Math.floor(totalEmployees * 0.25) },
        { department: 'HR', performance: 85, target: 80, employees: Math.floor(totalEmployees * 0.15) },
        { department: 'Finance', performance: 90, target: 85, employees: Math.floor(totalEmployees * 0.2) },
        { department: 'Operations', performance: 87, target: 85, employees: Math.floor(totalEmployees * 0.1) }
      ]

      setAnalyticsData({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalEmployees,
        totalPurchases,
        totalLeads,
        revenueGrowth,
        ordersGrowth,
        employeeGrowth,
        leadsGrowth,
        topProducts,
        recentOrders,
        revenueData,
        salesDistribution,
        departmentData,
        finance: financeData,
        orders: ordersData,
        inventory: inventoryData,
        hr: hrData,
        purchases: purchasesData,
        leads: leadsData
      })
      setError(null)
    } catch (err: any) {
      console.error('Failed to fetch analytics data:', err)
      setError(err.message || 'Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  // Custom tooltip formatter
  const formatCurrency = (value: number) => {
    return `Rp ${(value / 1000000).toFixed(1)}M`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{
          backgroundColor: 'white',
          p: 2,
          border: '1px solid #ccc',
          borderRadius: 1,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{label}</Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Revenue') || entry.name.includes('Target')
                ? formatCurrency(entry.value)
                : entry.value}
            </Typography>
          ))}
        </Box>
      )
    }
    return null
  }

  const kpiMetrics = [
    {
      title: 'Total Revenue',
      value: `Rp ${(analyticsData?.totalRevenue || 0).toLocaleString()}`,
      growth: analyticsData?.revenueGrowth || 0,
      icon: <AttachMoney />,
      color: '#4CAF50'
    },
    {
      title: 'Total Orders',
      value: (analyticsData?.totalOrders || 0).toString(),
      growth: analyticsData?.ordersGrowth || 0,
      icon: <ShoppingCart />,
      color: '#DC143C'
    },
    {
      title: 'Active Employees',
      value: (analyticsData?.totalEmployees || 0).toString(),
      growth: analyticsData?.employeeGrowth || 0,
      icon: <People />,
      color: '#2196F3'
    },
    {
      title: 'Total Leads',
      value: (analyticsData?.totalLeads || 0).toString(),
      growth: analyticsData?.leadsGrowth || 0,
      icon: <Business />,
      color: '#FF9800'
    }
  ]

  const performanceMetrics = [
    {
      title: 'Sales Performance',
      value: 85,
      target: 100,
      unit: '%',
      color: '#4CAF50'
    },
    {
      title: 'Customer Satisfaction',
      value: 92,
      target: 100,
      unit: '%',
      color: '#2196F3'
    },
    {
      title: 'Inventory Turnover',
      value: 78,
      target: 100,
      unit: '%',
      color: '#FF9800'
    },
    {
      title: 'Employee Productivity',
      value: 88,
      target: 100,
      unit: '%',
      color: '#9C27B0'
    }
  ]

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={40} sx={{ color: '#DC143C' }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
            Business Analytics 📈
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive business intelligence and performance metrics
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={selectedPeriod}
              label="Period"
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchAnalyticsData}
            sx={{
              borderColor: '#DC143C',
              color: '#DC143C',
              '&:hover': {
                borderColor: '#B91C3C',
                backgroundColor: 'rgba(220, 20, 60, 0.04)'
              }
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Business Intelligence Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, background: 'linear-gradient(135deg, #795548 0%, #5D4037 100%)', color: 'white' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Advanced Business Intelligence
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Dapatkan insights mendalam dengan dashboard analytics yang powerful.
              Real-time reports, data visualization, dan KPI tracking untuk decision making yang tepat.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                  }}
                  startIcon={<Dashboard />}
                >
                  Custom Dashboards
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                  startIcon={<Assessment />}
                >
                  Real-time Reports
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                  startIcon={<DataUsage />}
                >
                  Data Analytics
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                  startIcon={<Speed />}
                >
                  KPI Tracking
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              BI Features
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Dashboard sx={{ color: '#795548' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Custom Dashboards
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Personalized analytics views
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Assessment sx={{ color: '#2196F3' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Real-time Reports
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Live data & instant insights
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DataUsage sx={{ color: '#4CAF50' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Data Analytics
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Advanced data processing
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Speed sx={{ color: '#FF9800' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    KPI Tracking
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Performance monitoring
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* KPI Metrics */}
      <Grid container spacing={3} mb={4}>
        {kpiMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      {metric.title}
                    </Typography>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {metric.value}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      {metric.growth >= 0 ? (
                        <TrendingUp sx={{ fontSize: 16, color: '#4CAF50', mr: 0.5 }} />
                      ) : (
                        <TrendingDown sx={{ fontSize: 16, color: '#f44336', mr: 0.5 }} />
                      )}
                      <Typography variant="body2" sx={{ 
                        color: metric.growth >= 0 ? '#4CAF50' : '#f44336',
                        fontWeight: 'medium'
                      }}>
                        {metric.growth >= 0 ? '+' : ''}{metric.growth}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    backgroundColor: `${metric.color}15`, 
                    borderRadius: 2, 
                    p: 1.5,
                    color: metric.color
                  }}>
                    {metric.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Performance Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Performance Metrics
            </Typography>
            {performanceMetrics.map((metric, index) => (
              <Box key={index} mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">{metric.title}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {metric.value}{metric.unit} / {metric.target}{metric.unit}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(metric.value / metric.target) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: metric.color
                    }
                  }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Top Products by Value
            </Typography>
            <List>
              {(analyticsData?.topProducts || []).slice(0, 5).map((product: any, index: number) => (
                <ListItem key={product.id} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Chip 
                      label={`#${index + 1}`} 
                      size="small" 
                      sx={{ 
                        backgroundColor: index === 0 ? '#DC143C' : '#e0e0e0',
                        color: index === 0 ? 'white' : 'black'
                      }} 
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={product.name}
                    secondary={`Stock: ${product.stock} units`}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#DC143C' }}>
                    Rp {(product.stock * product.price).toLocaleString()}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Real Analytics Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Revenue Trends & Forecasting
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={analyticsData?.revenueData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#DC143C"
                  strokeWidth={3}
                  dot={{ fill: '#DC143C', strokeWidth: 2, r: 6 }}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#4CAF50"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#4CAF50', strokeWidth: 2, r: 4 }}
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Sales Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={analyticsData?.salesDistribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(analyticsData?.salesDistribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: string, props: any) => [
                    `${value}% (Rp ${(props.payload.amount / 1000000).toFixed(1)}M)`,
                    'Share'
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <Box mt={2}>
              {(analyticsData?.salesDistribution || []).map((item: any, index: number) => (
                <Box key={index} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: item.color,
                        borderRadius: '50%',
                        mr: 1
                      }}
                    />
                    <Typography variant="body2">{item.name}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {item.value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Department Performance Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Department Performance Analysis
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData?.departmentData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="performance" fill="#DC143C" name="Performance %" />
                <Bar dataKey="target" fill="#4CAF50" name="Target %" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

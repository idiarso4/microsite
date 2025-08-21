import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Snackbar
} from '@mui/material'
import {
  Assessment,
  TrendingUp,
  PieChart,
  BarChart,
  Download,
  DateRange,
  FilterList,
  CloudDownload,
  Print,
  Share,
  Schedule,
  TableChart,
  InsertDriveFile,
  PictureAsPdf,
  Description
} from '@mui/icons-material'
import { apiService } from '../../services/api'

export default function ReportsPage() {
  const [reportsData, setReportsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reportType, setReportType] = useState('sales')
  const [dateRange, setDateRange] = useState('month')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true)
        const [ordersData, leadsData, productsData, dashboardData] = await Promise.all([
          apiService.getOrders({ limit: 100 }),
          apiService.getLeads({ limit: 100 }),
          apiService.getProducts({ limit: 100 }),
          apiService.getDashboardOverview()
        ])

        // Calculate report metrics
        const totalSales = ordersData.orders?.reduce((sum: number, order: any) => 
          sum + (order.totalAmount || 0), 0) || 0
        
        const salesByStatus = ordersData.orders?.reduce((acc: any, order: any) => {
          acc[order.status] = (acc[order.status] || 0) + order.totalAmount
          return acc
        }, {}) || {}

        const leadsByStatus = leadsData.leads?.reduce((acc: any, lead: any) => {
          acc[lead.status] = (acc[lead.status] || 0) + 1
          return acc
        }, {}) || {}

        const topProducts = productsData.products?.sort((a: any, b: any) => 
          (b.stock * b.price) - (a.stock * a.price)).slice(0, 5) || []

        setReportsData({
          totalSales,
          salesByStatus,
          leadsByStatus,
          topProducts,
          orders: ordersData.orders || [],
          leads: leadsData.leads || [],
          products: productsData.products || [],
          stats: dashboardData.stats
        })
        setError(null)
      } catch (err) {
        console.error('Failed to fetch reports data:', err)
        setError('Failed to load reports data')
      } finally {
        setLoading(false)
      }
    }

    fetchReportsData()
  }, [reportType, dateRange])

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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Please try refreshing the page
        </Typography>
      </Box>
    )
  }

  const reportStats = [
    {
      title: 'Total Sales',
      value: `Rp ${(reportsData?.totalSales || 0).toLocaleString()}`,
      icon: <TrendingUp />,
      color: '#DC143C'
    },
    {
      title: 'Total Orders',
      value: reportsData?.orders?.length?.toString() || '0',
      icon: <Assessment />,
      color: '#4CAF50'
    },
    {
      title: 'Total Leads',
      value: reportsData?.leads?.length?.toString() || '0',
      icon: <PieChart />,
      color: '#FF9800'
    },
    {
      title: 'Products',
      value: reportsData?.products?.length?.toString() || '0',
      icon: <BarChart />,
      color: '#1A1A1A'
    }
  ]

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
            Reports & Analytics 📊
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Analisis data bisnis dan laporan komprehensif
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => {
              let url = ''
              let reportName = ''
              switch (reportType) {
                case 'sales':
                  url = 'http://localhost:3001/api/orders/export'
                  reportName = 'Sales Report'
                  break
                case 'financial':
                  url = 'http://localhost:3001/api/finance/export'
                  reportName = 'Financial Report'
                  break
                case 'inventory':
                  url = 'http://localhost:3001/api/products/export'
                  reportName = 'Inventory Report'
                  break
                case 'hr':
                  url = 'http://localhost:3001/api/employees/export'
                  reportName = 'HR Report'
                  break
                case 'procurement':
                  url = 'http://localhost:3001/api/purchases/export'
                  reportName = 'Procurement Report'
                  break
                default:
                  url = 'http://localhost:3001/api/orders/export'
                  reportName = 'Sales Report'
              }
              window.open(url, '_blank')
              setSnackbar({ open: true, message: `${reportName} exported successfully!`, severity: 'success' })
            }}
            sx={{
              borderColor: '#DC143C',
              color: '#DC143C',
              '&:hover': {
                borderColor: '#B91C3C',
                backgroundColor: 'rgba(220, 20, 60, 0.04)'
              }
            }}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Reports & Export Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, background: 'linear-gradient(135deg, #3F51B5 0%, #303F9F 100%)', color: 'white' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Comprehensive Reporting System
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Generate detailed reports dengan berbagai format export.
              Custom reports, scheduled reports, dan data analysis untuk semua modul bisnis.
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
                  startIcon={<TableChart />}
                >
                  Custom Reports
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
                  startIcon={<CloudDownload />}
                >
                  CSV Export
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
                  Data Analysis
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
                  startIcon={<Schedule />}
                >
                  Scheduled Reports
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Export Features
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <InsertDriveFile sx={{ color: '#4CAF50' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Excel Export
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    .xlsx format with formatting
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PictureAsPdf sx={{ color: '#F44336' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    PDF Reports
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Professional formatted reports
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Description sx={{ color: '#2196F3' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    CSV Data Export
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Raw data for analysis
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Schedule sx={{ color: '#FF9800' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Scheduled Reports
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Automated report delivery
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
          <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
          Report Filters
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="sales">Sales Report</MenuItem>
                <MenuItem value="inventory">Inventory Report</MenuItem>
                <MenuItem value="leads">Leads Report</MenuItem>
                <MenuItem value="financial">Financial Report</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => setDateRange(e.target.value)}
              >
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="quarter">This Quarter</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {reportStats.map((stat, index) => (
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
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: `${stat.color}15`,
                      color: stat.color,
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Report Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Sales by Status
            </Typography>
            <Box>
              {Object.entries(reportsData?.salesByStatus || {}).map(([status, amount]: [string, any]) => (
                <Box key={status} mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {status}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      Rp {amount.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 8,
                      backgroundColor: '#e0e0e0',
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        backgroundColor: '#DC143C',
                        width: `${Math.min((amount / (reportsData?.totalSales || 1)) * 100, 100)}%`,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Leads by Status
            </Typography>
            <Box>
              {Object.entries(reportsData?.leadsByStatus || {}).map(([status, count]: [string, any]) => (
                <Box key={status} mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {status}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {count} leads
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 8,
                      backgroundColor: '#e0e0e0',
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        backgroundColor: '#4CAF50',
                        width: `${Math.min((count / (reportsData?.leads?.length || 1)) * 100, 100)}%`,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Top Products by Value
            </Typography>
            <Grid container spacing={2}>
              {(reportsData?.topProducts || []).map((product: any, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: '#DC143C',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                      #{index + 1} {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Stock: {product.stock} units
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#DC143C', fontWeight: 'bold' }}>
                      Rp {(product.stock * product.price).toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

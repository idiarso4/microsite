import React, { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material'
import {
  Assessment,
  Add,
  Edit,
  Delete,
  Schedule,
  Download,
  Visibility,
  BarChart,
  PieChart,
  ShowChart,
  TableChart,
  TrendingUp,
  Business,
  Inventory,
  People,
  MonetizationOn,
  CloudDownload,
  InsertDriveFile,
  PictureAsPdf,
  Description,
  FilterList,
  Print,
  Close
} from '@mui/icons-material'
import ReportBuilder, { ReportConfig, ReportField } from '../reports/ReportBuilder'
import ReportChart, { generateSampleData } from '../reports/ReportChart'
import { useToast } from '../common/ToastProvider'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function ReportsPage() {
  const [tabValue, setTabValue] = useState(0)
  const [builderOpen, setBuilderOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewConfig, setPreviewConfig] = useState<ReportConfig | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reportsData, setReportsData] = useState<any>(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  })
  const [reportType, setReportType] = useState('sales')
  const [dateRange, setDateRange] = useState('month')
  const [savedReports, setSavedReports] = useState<ReportConfig[]>([
    {
      name: 'Monthly Sales Report',
      description: 'Monthly sales performance analysis',
      type: 'chart',
      chartType: 'bar',
      fields: ['month', 'revenue', 'orders'],
      filters: [],
      groupBy: ['month']
    },
    {
      name: 'Product Category Analysis',
      description: 'Sales breakdown by product category',
      type: 'chart',
      chartType: 'pie',
      fields: ['category', 'sales'],
      filters: [],
      groupBy: ['category']
    },
    {
      name: 'Customer List',
      description: 'Complete customer database',
      type: 'table',
      fields: ['name', 'email', 'company', 'phone', 'status'],
      filters: []
    }
  ])

  const toast = useToast()

  // Sample available fields for report building
  const availableFields: ReportField[] = [
    // Sales fields
    { id: 'sales_date', name: 'sales_date', type: 'date', label: 'Sale Date', table: 'Sales' },
    { id: 'sales_amount', name: 'amount', type: 'number', label: 'Sale Amount', table: 'Sales' },
    { id: 'sales_quantity', name: 'quantity', type: 'number', label: 'Quantity', table: 'Sales' },
    { id: 'sales_status', name: 'status', type: 'enum', label: 'Status', table: 'Sales' },

    // Customer fields
    { id: 'customer_name', name: 'name', type: 'text', label: 'Customer Name', table: 'Customers' },
    { id: 'customer_email', name: 'email', type: 'text', label: 'Email', table: 'Customers' },
    { id: 'customer_company', name: 'company', type: 'text', label: 'Company', table: 'Customers' },
    { id: 'customer_phone', name: 'phone', type: 'text', label: 'Phone', table: 'Customers' },

    // Product fields
    { id: 'product_name', name: 'name', type: 'text', label: 'Product Name', table: 'Products' },
    { id: 'product_category', name: 'category', type: 'enum', label: 'Category', table: 'Products' },
    { id: 'product_price', name: 'price', type: 'number', label: 'Price', table: 'Products' },
    { id: 'product_stock', name: 'stock', type: 'number', label: 'Stock', table: 'Products' },

    // Order fields
    { id: 'order_date', name: 'order_date', type: 'date', label: 'Order Date', table: 'Orders' },
    { id: 'order_total', name: 'total', type: 'number', label: 'Order Total', table: 'Orders' },
    { id: 'order_status', name: 'status', type: 'enum', label: 'Order Status', table: 'Orders' }
  ]

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleSaveReport = (config: ReportConfig) => {
    setSavedReports(prev => [...prev, config])
    setBuilderOpen(false)
    toast.success(`Report "${config.name}" saved successfully!`)
  }

  const handlePreviewReport = (config: ReportConfig) => {
    setPreviewConfig(config)
    setPreviewOpen(true)
  }

  const handleDeleteReport = (index: number) => {
    const report = savedReports[index]
    setSavedReports(prev => prev.filter((_, i) => i !== index))
    toast.success(`Report "${report.name}" deleted successfully!`)
  }

  const handleScheduleReport = (config: ReportConfig, schedule: any) => {
    toast.info(`Report "${config.name}" scheduled successfully!`)
  }

  const getReportIcon = (type: string, chartType?: string) => {
    if (type === 'table') return <TableChart />
    if (type === 'chart') {
      switch (chartType) {
        case 'bar': return <BarChart />
        case 'line': return <ShowChart />
        case 'pie': return <PieChart />
        case 'area': return <ShowChart />
        default: return <Assessment />
      }
    }
    return <Assessment />
  }

  // Sample dashboard charts
  const dashboardCharts = [
    {
      title: 'Monthly Revenue Trend',
      subtitle: 'Revenue performance over the last 12 months',
      type: 'line' as const,
      data: generateSampleData('monthly', 12),
      xAxisKey: 'name',
      yAxisKey: 'revenue'
    },
    {
      title: 'Sales by Category',
      subtitle: 'Distribution of sales across product categories',
      type: 'pie' as const,
      data: generateSampleData('category', 5),
      xAxisKey: 'name',
      yAxisKey: 'value'
    },
    {
      title: 'Weekly Orders',
      subtitle: 'Order volume trend over recent weeks',
      type: 'bar' as const,
      data: generateSampleData('trend', 8),
      xAxisKey: 'name',
      yAxisKey: 'value'
    },
    {
      title: 'Growth Trend',
      subtitle: 'Business growth metrics over time',
      type: 'area' as const,
      data: generateSampleData('trend', 10),
      xAxisKey: 'name',
      yAxisKey: 'value'
    }
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Reports & Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create custom reports and analyze your business data
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setBuilderOpen(true)}
          sx={{
            bgcolor: '#DC143C',
            '&:hover': { bgcolor: '#B91C3C' }
          }}
        >
          Create Report
        </Button>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Dashboard" icon={<Assessment />} />
          <Tab label="My Reports" icon={<Business />} />
          <Tab label="Scheduled" icon={<Schedule />} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {dashboardCharts.map((chart, index) => (
              <Grid item xs={12} md={6} key={index}>
                <ReportChart
                  {...chart}
                  onExport={(format) => toast.info(`Exporting chart as ${format.toUpperCase()}...`)}
                  onRefresh={() => toast.info('Refreshing chart data...')}
                />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {savedReports.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No reports created yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first custom report to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setBuilderOpen(true)}
                sx={{
                  bgcolor: '#DC143C',
                  '&:hover': { bgcolor: '#B91C3C' }
                }}
              >
                Create Report
              </Button>
            </Box>
          ) : (
            <List>
              {savedReports.map((report, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      {getReportIcon(report.type, report.chartType)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {report.name}
                          <Chip
                            label={report.type}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                          {report.chartType && (
                            <Chip
                              label={report.chartType}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                      secondary={report.description}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={() => handlePreviewReport(report)}
                        sx={{ mr: 1 }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteReport(index)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < savedReports.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Schedule sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No scheduled reports
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Schedule reports to be automatically generated and sent
            </Typography>
          </Box>
        </TabPanel>
      </Paper>

      {/* Report Builder Dialog */}
      <Dialog
        open={builderOpen}
        onClose={() => setBuilderOpen(false)}
        maxWidth="xl"
        fullWidth
      >
        <ReportBuilder
          availableFields={availableFields}
          onSave={handleSaveReport}
          onPreview={handlePreviewReport}
          onSchedule={handleScheduleReport}
        />
      </Dialog>

      {/* Report Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Report Preview: {previewConfig?.name}
        </DialogTitle>
        <DialogContent>
          {previewConfig && previewConfig.type === 'chart' && (
            <ReportChart
              title={previewConfig.name}
              subtitle={previewConfig.description}
              type={previewConfig.chartType || 'bar'}
              data={generateSampleData('monthly', 6)}
              height={400}
            />
          )}
          {previewConfig && previewConfig.type === 'table' && (
            <Typography variant="body1" sx={{ py: 4, textAlign: 'center' }}>
              Table preview would show here with selected fields: {previewConfig.fields.join(', ')}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            sx={{
              bgcolor: '#DC143C',
              '&:hover': { bgcolor: '#B91C3C' }
            }}
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading and Error States */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} sx={{ color: '#DC143C' }} />
        </Box>
      )}

      {error && (
        <Box textAlign="center" py={8}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Please try refreshing the page
          </Typography>
        </Box>
      )}

      {/* Report Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
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
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6">{stat.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
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
        {[
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
        ].map((stat, index) => (
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

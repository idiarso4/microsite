import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  LocalShipping,
  Inventory,
  AttachMoney,
  Assignment,
  Download,
  Add,
  Search,
  Refresh,
  Visibility,
  Edit,
  Delete,
  Print
} from '@mui/icons-material'
import { apiService } from '../../services/api'

export default function ProcurementPage() {
  const [procurementData, setProcurementData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProcurementData()
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter])

  const fetchProcurementData = async () => {
    try {
      setLoading(true)
      const params: any = { limit: 20 }
      if (searchTerm) params.search = searchTerm
      if (statusFilter) params.status = statusFilter

      const data = await apiService.getPurchases(params)
      setProcurementData(data)
      setError(null)
    } catch (err: any) {
      console.error('Failed to fetch procurement data:', err)
      setError(err.message || 'Failed to load procurement data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return '#4CAF50'
      case 'approved': return '#2196F3'
      case 'pending': return '#FF9800'
      case 'cancelled': return '#f44336'
      default: return '#757575'
    }
  }

  const procurementStats = [
    {
      title: 'Total Purchases',
      value: (procurementData?.pagination?.total || 0).toString(),
      change: '+8.2%',
      trend: 'up',
      icon: <LocalShipping />,
      color: '#DC143C'
    },
    {
      title: 'Pending Orders',
      value: (procurementData?.purchases?.filter((p: any) => p.status === 'pending')?.length || 0).toString(),
      change: '+5.1%',
      trend: 'up',
      icon: <Assignment />,
      color: '#FF9800'
    },
    {
      title: 'Total Value',
      value: `Rp ${(procurementData?.purchases?.reduce((sum: number, p: any) => sum + (p.totalAmount || 0), 0) || 0).toLocaleString()}`,
      change: '+12.3%',
      trend: 'up',
      icon: <AttachMoney />,
      color: '#4CAF50'
    },
    {
      title: 'Suppliers',
      value: new Set(procurementData?.purchases?.map((p: any) => p.supplierName) || []).size.toString(),
      change: '+2',
      trend: 'up',
      icon: <Inventory />,
      color: '#1A1A1A'
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
            Procurement Management 🚚
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Kelola pembelian dan supplier dengan mudah
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => window.open('http://localhost:3001/api/purchases/export', '_blank')}
            sx={{
              borderColor: '#DC143C',
              color: '#DC143C',
              '&:hover': {
                borderColor: '#B91C3C',
                backgroundColor: 'rgba(220, 20, 60, 0.04)'
              }
            }}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              // TODO: Open purchase form
              setSnackbar({ open: true, message: 'Purchase form coming soon!', severity: 'info' })
            }}
            sx={{
              background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(220, 20, 60, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            New Purchase
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {procurementStats.map((stat, index) => (
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
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      {stat.trend === 'up' ? (
                        <TrendingUp sx={{ fontSize: 16, color: '#4CAF50', mr: 0.5 }} />
                      ) : (
                        <TrendingDown sx={{ fontSize: 16, color: '#f44336', mr: 0.5 }} />
                      )}
                      <Typography variant="body2" sx={{ 
                        color: stat.trend === 'up' ? '#4CAF50' : '#f44336',
                        fontWeight: 'medium'
                      }}>
                        {stat.change}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    backgroundColor: `${stat.color}15`, 
                    borderRadius: 2, 
                    p: 1.5,
                    color: stat.color
                  }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Purchases Table */}
      <Paper sx={{ borderRadius: 2 }}>
        <Box p={3} borderBottom="1px solid #e0e0e0">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Purchase Orders
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                size="small"
                placeholder="Search purchases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 250 }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="received">Received</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={fetchProcurementData}
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
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Purchase Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Supplier</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Purchase Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(procurementData?.purchases || []).map((purchase: any) => (
                <TableRow key={purchase.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {purchase.purchaseNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {purchase.supplierName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {purchase.supplierEmail}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>
                    Rp {purchase.totalAmount?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={purchase.status}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(purchase.status)}15`,
                        color: getStatusColor(purchase.status),
                        fontWeight: 'medium',
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(purchase.purchaseDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => {
                          // TODO: View purchase details
                          setSnackbar({ open: true, message: 'View details coming soon!', severity: 'info' })
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
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Print />}
                        onClick={() => {
                          // TODO: Print purchase order
                          setSnackbar({ open: true, message: 'Print feature coming soon!', severity: 'info' })
                        }}
                        sx={{
                          borderColor: '#4CAF50',
                          color: '#4CAF50',
                          '&:hover': {
                            borderColor: '#388E3C',
                            backgroundColor: 'rgba(76, 175, 80, 0.04)'
                          }
                        }}
                      >
                        Print
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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

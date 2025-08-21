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
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
  Menu,
  MenuItem
} from '@mui/material'
import {
  Add,
  Search,
  Edit,
  Delete,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  AttachMoney,
  People,
  LocalShipping,
  Download,
  MoreVert,
  Visibility
} from '@mui/icons-material'
import { apiService } from '../../services/api'
import OrderForm, { OrderFormData } from '../forms/OrderForm'
import OrderDetailsModal from '../modals/OrderDetailsModal'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return '#4CAF50'
    case 'pending': return '#FF9800'
    case 'processing': return '#2196F3'
    case 'cancelled': return '#f44336'
    default: return '#757575'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed': return 'Completed'
    case 'pending': return 'Pending'
    case 'processing': return 'Processing'
    case 'cancelled': return 'Cancelled'
    default: return 'Unknown'
  }
}

export default function OrdersPage() {
  const [ordersData, setOrdersData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  const fetchOrdersData = async () => {
    try {
      setLoading(true)
      const params: any = { limit: 10 }
      if (searchTerm) params.search = searchTerm
      if (statusFilter) params.status = statusFilter
      
      const data = await apiService.getOrders(params)
      setOrdersData(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch orders data:', err)
      setError('Failed to load orders data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOrdersData()
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter])

  const handleCreateOrder = async (data: OrderFormData) => {
    try {
      await apiService.createOrder(data)
      setSnackbar({ open: true, message: 'Order berhasil ditambahkan!', severity: 'success' })
      fetchOrdersData()
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Gagal menambahkan order', severity: 'error' })
      throw error
    }
  }

  const handleUpdateOrder = async (data: OrderFormData) => {
    try {
      await apiService.updateOrder(editingOrder.id, data)
      setSnackbar({ open: true, message: 'Order berhasil diperbarui!', severity: 'success' })
      fetchOrdersData()
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Gagal memperbarui order', severity: 'error' })
      throw error
    }
  }

  const handleDeleteOrder = async (orderId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus order ini?')) {
      try {
        await apiService.deleteOrder(orderId)
        setSnackbar({ open: true, message: 'Order berhasil dihapus!', severity: 'success' })
        fetchOrdersData()
      } catch (error: any) {
        setSnackbar({ open: true, message: error.message || 'Gagal menghapus order', severity: 'error' })
      }
    }
  }

  const handleViewOrder = async (orderId: number) => {
    try {
      const data = await apiService.getOrder(orderId) as any
      setOrderDetails(data.order)
      setDetailsOpen(true)
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Gagal memuat detail order', severity: 'error' })
    }
  }

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await apiService.updateOrderStatus(orderId, status)
      setSnackbar({ open: true, message: 'Order status updated!', severity: 'success' })
      fetchOrdersData()
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Failed to update order', severity: 'error' })
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, order: any) => {
    setAnchorEl(event.currentTarget)
    setSelectedOrder(order)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedOrder(null)
  }

  const handleViewOrderFromMenu = () => {
    if (selectedOrder) {
      handleViewOrder(selectedOrder.id)
    }
    handleMenuClose()
  }

  const handleEditOrderFromMenu = () => {
    setEditingOrder(selectedOrder)
    setFormOpen(true)
    handleMenuClose()
  }

  const handleDeleteOrderFromMenu = () => {
    if (selectedOrder) {
      handleDeleteOrder(selectedOrder.id)
    }
    handleMenuClose()
  }

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

  const orderStats = [
    {
      title: 'Total Orders',
      value: ordersData?.orders?.length?.toString() || '0',
      change: '+12.5%',
      trend: 'up',
      icon: <ShoppingCart />,
      color: '#DC143C'
    },
    {
      title: 'Total Revenue',
      value: `Rp ${(ordersData?.orders?.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0) || 0).toLocaleString()}`,
      change: '+8.2%',
      trend: 'up',
      icon: <AttachMoney />,
      color: '#1A1A1A'
    },
    {
      title: 'Completed Orders',
      value: ordersData?.orders?.filter((order: any) => order.status === 'completed')?.length?.toString() || '0',
      change: '+15.3%',
      trend: 'up',
      icon: <LocalShipping />,
      color: '#4CAF50'
    },
    {
      title: 'Pending Orders',
      value: ordersData?.orders?.filter((order: any) => order.status === 'pending')?.length?.toString() || '0',
      change: '-2.1%',
      trend: 'down',
      icon: <People />,
      color: '#FF9800'
    }
  ]

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
            Orders Management 🛒
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Kelola pesanan dan transaksi pelanggan
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => window.open('http://localhost:3001/api/orders/export', '_blank')}
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
              setEditingOrder(null)
              setFormOpen(true)
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
            New Order
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {orderStats.map((stat, index) => (
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

      {/* Search and Filter */}
      <Paper sx={{ borderRadius: 2, mb: 3, p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search orders by order number or customer..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#DC143C' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#DC143C',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#DC143C',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Filter by Status"
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStatusFilter(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#DC143C',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#DC143C',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#DC143C',
                },
              }}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
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
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Table */}
      <Paper sx={{ borderRadius: 2 }}>
        <Box p={3} borderBottom="1px solid #e0e0e0">
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Orders ({ordersData?.orders?.length || 0})
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Order Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Order Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(ordersData?.orders || []).map((order: any) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {order.orderNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {order.customer?.company || order.customer?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.customer?.email}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>
                    Rp {order.totalAmount?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(order.status)}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(order.status)}15`,
                        color: getStatusColor(order.status),
                        fontWeight: 'medium'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, order)}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewOrderFromMenu}>
          <Visibility sx={{ mr: 1, fontSize: 18 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEditOrderFromMenu}>
          <Edit sx={{ mr: 1, fontSize: 18 }} />
          Edit Order
        </MenuItem>
        <MenuItem onClick={handleDeleteOrderFromMenu}>
          <Delete sx={{ mr: 1, fontSize: 18, color: '#f44336' }} />
          Delete Order
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedOrder) {
            handleUpdateOrderStatus(selectedOrder.id, 'completed')
          }
          handleMenuClose()
        }}>
          <LocalShipping sx={{ mr: 1, fontSize: 18, color: '#4CAF50' }} />
          Mark as Completed
        </MenuItem>
      </Menu>

      {/* Order Form Dialog */}
      <OrderForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingOrder(null)
        }}
        onSubmit={editingOrder ? handleUpdateOrder : handleCreateOrder}
        initialData={editingOrder}
        title={editingOrder ? 'Edit Order' : 'Add New Order'}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false)
          setOrderDetails(null)
        }}
        order={orderDetails}
        onPrint={() => {
          setSnackbar({ open: true, message: 'Invoice printed successfully!', severity: 'success' })
        }}
      />

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

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
  LinearProgress,
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
  Warning,
  CheckCircle,
  Inventory,
  TrendingUp,
  TrendingDown,
  Category,
  LocalShipping,
  Download,
  MoreVert
} from '@mui/icons-material'
import { apiService } from '../../services/api'
import ProductForm from '../forms/ProductForm'
import { ProductFormData } from '../../utils/validationSchemas'



const getStatusColor = (status: string) => {
  switch (status) {
    case 'in_stock': return '#4CAF50'
    case 'low_stock': return '#FF9800'
    case 'critical': return '#f44336'
    case 'out_of_stock': return '#757575'
    default: return '#757575'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'in_stock': return 'In Stock'
    case 'low_stock': return 'Low Stock'
    case 'critical': return 'Critical'
    case 'out_of_stock': return 'Out of Stock'
    default: return 'Unknown'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'in_stock': return <CheckCircle />
    case 'low_stock': return <Warning />
    case 'critical': return <Warning />
    case 'out_of_stock': return <Warning />
    default: return <Warning />
  }
}

export default function InventoryPage() {
  const [productsData, setProductsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const fetchProductsData = async () => {
    try {
      setLoading(true)
      const data = await apiService.getProducts({ limit: 10 })
      setProductsData(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch products data:', err)
      setError('Failed to load products data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductsData()
  }, [])

  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      await apiService.createProduct(data)
      setSnackbar({ open: true, message: 'Produk berhasil ditambahkan!', severity: 'success' })
      fetchProductsData()
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Gagal menambahkan produk', severity: 'error' })
      throw error
    }
  }

  const handleUpdateProduct = async (data: ProductFormData) => {
    try {
      await apiService.updateProduct(editingProduct.id, data)
      setSnackbar({ open: true, message: 'Produk berhasil diperbarui!', severity: 'success' })
      fetchProductsData()
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Gagal memperbarui produk', severity: 'error' })
      throw error
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await apiService.deleteProduct(productId)
        setSnackbar({ open: true, message: 'Produk berhasil dihapus!', severity: 'success' })
        fetchProductsData()
      } catch (error: any) {
        setSnackbar({ open: true, message: error.message || 'Gagal menghapus produk', severity: 'error' })
      }
    }
  }

  const handleExportProducts = () => {
    window.open('http://localhost:3001/api/products/export', '_blank')
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, product: any) => {
    setAnchorEl(event.currentTarget)
    setSelectedProduct(product)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedProduct(null)
  }

  const handleEdit = () => {
    setEditingProduct(selectedProduct)
    setFormOpen(true)
    handleMenuClose()
  }

  const handleDelete = () => {
    if (selectedProduct) {
      handleDeleteProduct(selectedProduct.id)
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

  const inventoryStats = [
    {
      title: 'Total Products',
      value: productsData?.products?.length?.toString() || '0',
      change: '+8.2%',
      trend: 'up',
      icon: <Inventory />,
      color: '#DC143C'
    },
    {
      title: 'Low Stock Items',
      value: productsData?.products?.filter((p: any) => p.stock <= p.minStock)?.length?.toString() || '0',
      change: '-12.5%',
      trend: 'down',
      icon: <Warning />,
      color: '#FF9800'
    },
    {
      title: 'Categories',
      value: '4',
      change: '+3.1%',
      trend: 'up',
      icon: <Category />,
      color: '#1A1A1A'
    },
    {
      title: 'Total Value',
      value: `Rp ${(productsData?.products?.reduce((sum: number, p: any) => sum + (p.price * p.stock), 0) || 0).toLocaleString()}`,
      change: '+15.7%',
      trend: 'up',
      icon: <TrendingUp />,
      color: '#DC143C'
    }
  ]

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
            Inventory Management 📦
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Kelola stok produk dan inventory Anda dengan mudah
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportProducts}
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
            variant="outlined"
            startIcon={<LocalShipping />}
            sx={{
              borderColor: '#DC143C',
              color: '#DC143C',
              '&:hover': {
                backgroundColor: '#DC143C',
                color: 'white'
              }
            }}
          >
            Restock
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditingProduct(null)
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
            Add Product
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {inventoryStats.map((stat, index) => (
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

      {/* Stock Alerts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #FF980020' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#FF9800' }}>
              ⚠️ Stock Alerts
            </Typography>
            <Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Items requiring immediate attention
              </Typography>
              <Box mb={2}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  Printer HP LaserJet
                </Typography>
                <Typography variant="caption" color="error">
                  Critical: Only 2 units left
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  Office Chair Ergonomic
                </Typography>
                <Typography variant="caption" color="warning.main">
                  Low Stock: 8 units remaining
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Inventory Overview by Category
            </Typography>
            <Grid container spacing={2}>
              {[
                { name: 'Electronics', count: 1456, value: 'Rp 32.1M', color: '#DC143C' },
                { name: 'Furniture', count: 234, value: 'Rp 8.7M', color: '#1A1A1A' },
                { name: 'Office Supplies', count: 567, value: 'Rp 3.2M', color: '#DC143C' },
                { name: 'Others', count: 199, value: 'Rp 1.2M', color: '#1A1A1A' }
              ].map((category, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: `${category.color}10`,
                      border: `1px solid ${category.color}20`
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="h6" sx={{ color: category.color, fontWeight: 'bold' }}>
                      {category.count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Products Table */}
      <Paper sx={{ borderRadius: 2 }}>
        <Box p={3} borderBottom="1px solid #e0e0e0">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Product Inventory
            </Typography>
            <TextField
              size="small"
              placeholder="Search products..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(productsData?.products || []).map((product: any) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {product.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {product.sku}
                    </Typography>
                  </TableCell>
                  <TableCell>{product.category?.name}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {product.stock} units
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(product.stock / (product.minStock * 3)) * 100}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getStatusColor(product.status)
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(product.status)}
                      label={getStatusLabel(product.status)}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(product.status)}15`,
                        color: getStatusColor(product.status),
                        fontWeight: 'medium'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>Rp {product.price?.toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, product)}
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
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1, fontSize: 18 }} />
          Edit Product
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete sx={{ mr: 1, fontSize: 18, color: '#f44336' }} />
          Delete Product
        </MenuItem>
      </Menu>

      {/* Product Form Dialog */}
      <ProductForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingProduct(null)
        }}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        initialData={editingProduct}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
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

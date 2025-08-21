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
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  Badge
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
  MoreVert,
  QrCode,
  Warehouse,
  Analytics,
  Notifications,
  Settings,
  Print
} from '@mui/icons-material'
import { inventoryApi, Product, Warehouse as WarehouseType, StockLevel } from '../../services/modules'



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
  const [products, setProducts] = useState<Product[]>([])
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([])
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch products, stock levels, and warehouses in parallel
      const [productsResponse, stockResponse, warehousesResponse] = await Promise.all([
        inventoryApi.getProducts({ page: 1, per_page: 50 }),
        inventoryApi.getStock({ page: 1, per_page: 50 }),
        inventoryApi.getWarehouses({ page: 1, per_page: 20 })
      ])

      if (productsResponse.success && productsResponse.data) {
        setProducts(productsResponse.data.data)
      }

      if (stockResponse.success && stockResponse.data) {
        setStockLevels(stockResponse.data.data)
      }

      if (warehousesResponse.success && warehousesResponse.data) {
        setWarehouses(warehousesResponse.data.data)
      }

      setError(null)
    } catch (err) {
      console.error('Failed to fetch inventory data:', err)
      setError('Failed to load inventory data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        const response = await inventoryApi.deleteProduct(productId)
        if (response.success) {
          setSnackbar({ open: true, message: 'Produk berhasil dihapus!', severity: 'success' })
          fetchData()
        } else {
          setSnackbar({ open: true, message: response.error || 'Gagal menghapus produk', severity: 'error' })
        }
      } catch (error: any) {
        setSnackbar({ open: true, message: error.message || 'Gagal menghapus produk', severity: 'error' })
      }
    }
  }

  const handleExportProducts = () => {
    window.open('http://localhost:3001/api/products/export', '_blank')
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, product: Product) => {
    setAnchorEl(event.currentTarget)
    setSelectedProduct(product)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedProduct(null)
  }

  const handleDelete = () => {
    if (selectedProduct) {
      handleDeleteProduct(selectedProduct.id)
    }
    handleMenuClose()
  }

  // Calculate inventory statistics
  const lowStockProducts = products.filter(p => p.current_stock <= p.minimum_stock)
  const totalValue = products.reduce((sum, p) => sum + (p.selling_price * p.current_stock), 0)

  // Get product status based on stock level
  const getProductStatus = (product: Product) => {
    if (product.current_stock === 0) return 'out_of_stock'
    if (product.current_stock <= product.minimum_stock * 0.5) return 'critical'
    if (product.current_stock <= product.minimum_stock) return 'low_stock'
    return 'in_stock'
  }

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      value: products.length.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: <Inventory />,
      color: '#DC143C'
    },
    {
      title: 'Low Stock Items',
      value: lowStockProducts.length.toString(),
      change: lowStockProducts.length > 0 ? '+12.5%' : '-12.5%',
      trend: lowStockProducts.length > 0 ? 'up' : 'down',
      icon: <Warning />,
      color: '#FF9800'
    },
    {
      title: 'Warehouses',
      value: warehouses.length.toString(),
      change: '+3.1%',
      trend: 'up',
      icon: <Warehouse />,
      color: '#1A1A1A'
    },
    {
      title: 'Total Value',
      value: `Rp ${totalValue.toLocaleString('id-ID')}`,
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
              setSnackbar({ open: true, message: 'Add Product feature coming soon!', severity: 'info' })
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

      {/* Monitoring Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Monitoring Ribuan Stok Barang Tanpa Ribet
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Pantau dan kendalikan pergerakan stok barang secara real-time dari beberapa lokasi gudang sekaligus dan cegah inventory loss secara efektif & efisien.
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#FF9800',
                color: 'white',
                '&:hover': { backgroundColor: '#F57C00' }
              }}
            >
              Lihat Cara Kerja Sistem Inventaris
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Fitur
            </Typography>
            <List sx={{ py: 0 }}>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <QrCode sx={{ color: '#4CAF50' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Barcode Management"
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Analytics sx={{ color: '#2196F3' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Analisa Stock Aging"
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <QrCode sx={{ color: '#FF9800' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Barcode/QR/RFID Scanning"
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Warehouse sx={{ color: '#9C27B0' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Stock Request Management"
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Settings sx={{ color: '#607D8B' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Strategi FIFO/FEFO/LIFO"
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Analytics sx={{ color: '#795548' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Multi-Unit of Measurement"
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircle sx={{ color: '#4CAF50' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Prediksi Kebutuhan Stok"
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Notifications sx={{ color: '#FF5722' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Mobile Access"
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              {filteredProducts.map((product) => {
                const status = getProductStatus(product)
                return (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.description || 'No description'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {product.sku}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {product.category?.name || 'Uncategorized'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {product.current_stock} {product.unit_of_measure}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Min: {product.minimum_stock}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min((product.current_stock / (product.minimum_stock * 3)) * 100, 100)}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getStatusColor(status)
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(status)}
                        label={getStatusLabel(status)}
                        size="small"
                        sx={{
                          backgroundColor: `${getStatusColor(status)}15`,
                          color: getStatusColor(status),
                          fontWeight: 'medium'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      Rp {product.selling_price.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, product)}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm ? 'No products found matching your search' : 'No products available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
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
        <MenuItem onClick={() => {
          setSnackbar({ open: true, message: 'Edit feature coming soon!', severity: 'info' })
          handleMenuClose()
        }}>
          <Edit sx={{ mr: 1, fontSize: 18 }} />
          Edit Product
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete sx={{ mr: 1, fontSize: 18, color: '#f44336' }} />
          Delete Product
        </MenuItem>
        <MenuItem onClick={() => {
          setSnackbar({ open: true, message: 'View details feature coming soon!', severity: 'info' })
          handleMenuClose()
        }}>
          <Analytics sx={{ mr: 1, fontSize: 18 }} />
          View Details
        </MenuItem>
      </Menu>

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

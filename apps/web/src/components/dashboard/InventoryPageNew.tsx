import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  LinearProgress
} from '@mui/material'
import {
  Inventory,
  Category,
  TrendingUp,
  TrendingDown,
  Warning,
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Print,
  Download,
  SwapHoriz
} from '@mui/icons-material'
import { 
  DataTable, 
  Column, 
  DeleteConfirmDialog, 
  PrintExportMenu,
  PrintUtils,
  ExportUtils
} from '../common'
import ProductForm from '../forms/ProductForm'
import CategoryForm from '../forms/CategoryForm'
import StockMovementForm from '../forms/StockMovementForm'
import { apiService } from '../../services/api'

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
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function InventoryPageNew() {
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Data states
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [stockMovements, setStockMovements] = useState<any[]>([])
  
  // Form states
  const [productFormOpen, setProductFormOpen] = useState(false)
  const [categoryFormOpen, setCategoryFormOpen] = useState(false)
  const [stockMovementFormOpen, setStockMovementFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<any>(null)
  const [deleteType, setDeleteType] = useState<'product' | 'category' | 'movement'>('product')
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  })

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [productsData, categoriesData] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories?.() || Promise.resolve({ categories: [] })
      ])
      
      setProducts(productsData.products || [])
      setCategories(categoriesData.categories || [])
      
      // Mock stock movements data
      setStockMovements([
        {
          id: 1,
          productName: 'Laptop Dell XPS 13',
          type: 'in',
          quantity: 10,
          reason: 'Purchase Order',
          date: '2024-01-15',
          performedBy: 'John Doe'
        },
        {
          id: 2,
          productName: 'iPhone 15 Pro',
          type: 'out',
          quantity: 5,
          reason: 'Sale',
          date: '2024-01-14',
          performedBy: 'Jane Smith'
        }
      ])
    } catch (err) {
      setError('Failed to load inventory data')
      console.error('Error loading inventory data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Product columns
  const productColumns: Column[] = [
    { 
      id: 'name', 
      label: 'Product', 
      minWidth: 200,
      filterable: true,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            <Inventory />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold">{value}</Typography>
            <Typography variant="caption" color="text.secondary">SKU: {row.sku}</Typography>
          </Box>
        </Box>
      )
    },
    { 
      id: 'category', 
      label: 'Category', 
      minWidth: 120,
      filterable: true,
      format: (value) => value ? <Chip label={value} variant="outlined" size="small" /> : '-'
    },
    { 
      id: 'price', 
      label: 'Price', 
      minWidth: 100,
      align: 'right',
      format: (value) => `$${value?.toFixed(2) || '0.00'}`
    },
    { 
      id: 'stock', 
      label: 'Stock', 
      minWidth: 100,
      align: 'center',
      format: (value, row) => {
        const isLowStock = value <= (row.minStock || 0)
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="body2" 
              color={isLowStock ? 'error.main' : 'text.primary'}
              fontWeight={isLowStock ? 'bold' : 'normal'}
            >
              {value || 0}
            </Typography>
            {isLowStock && <Warning color="error" fontSize="small" />}
          </Box>
        )
      }
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 100,
      format: (value) => {
        const colors = { 
          active: 'success', 
          inactive: 'default', 
          discontinued: 'error' 
        }
        return (
          <Chip
            label={value?.toUpperCase()}
            color={colors[value as keyof typeof colors] as any}
            size="small"
          />
        )
      }
    }
  ]

  // Category columns
  const categoryColumns: Column[] = [
    { 
      id: 'name', 
      label: 'Category Name', 
      minWidth: 200,
      filterable: true,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: row.color || '#2196f3' }}>
            <Category />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold">{value}</Typography>
            <Typography variant="caption" color="text.secondary">{row.description}</Typography>
          </Box>
        </Box>
      )
    },
    { 
      id: 'productCount', 
      label: 'Products', 
      minWidth: 100,
      align: 'center',
      format: (value) => (
        <Chip label={value || 0} variant="outlined" size="small" />
      )
    },
    { 
      id: 'isActive', 
      label: 'Status', 
      minWidth: 100,
      format: (value) => (
        <Chip
          label={value ? 'Active' : 'Inactive'}
          color={value ? 'success' : 'default'}
          size="small"
        />
      )
    }
  ]

  // Stock Movement columns
  const stockMovementColumns: Column[] = [
    { 
      id: 'productName', 
      label: 'Product', 
      minWidth: 180,
      filterable: true
    },
    { 
      id: 'type', 
      label: 'Type', 
      minWidth: 100,
      format: (value) => {
        const config = {
          in: { label: 'Stock In', color: 'success', icon: <TrendingUp /> },
          out: { label: 'Stock Out', color: 'error', icon: <TrendingDown /> },
          adjustment: { label: 'Adjustment', color: 'warning', icon: <SwapHoriz /> }
        }
        const item = config[value as keyof typeof config]
        return item ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {item.icon}
            <Chip label={item.label} color={item.color as any} size="small" />
          </Box>
        ) : value
      }
    },
    { 
      id: 'quantity', 
      label: 'Quantity', 
      minWidth: 100,
      align: 'center',
      format: (value, row) => {
        const isNegative = row.type === 'out'
        return (
          <Typography 
            variant="body2" 
            color={isNegative ? 'error.main' : 'success.main'}
            fontWeight="bold"
          >
            {isNegative ? '-' : '+'}{value}
          </Typography>
        )
      }
    },
    { 
      id: 'reason', 
      label: 'Reason', 
      minWidth: 140,
      filterable: true
    },
    { 
      id: 'date', 
      label: 'Date', 
      minWidth: 120,
      format: (value) => new Date(value).toLocaleDateString()
    },
    { 
      id: 'performedBy', 
      label: 'Performed By', 
      minWidth: 140,
      filterable: true
    }
  ]

  // CRUD handlers for Products
  const handleCreateProduct = async (data: any) => {
    try {
      await apiService.createProduct(data)
      await loadData()
      setSnackbar({ open: true, message: 'Product created successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create product', severity: 'error' })
    }
  }

  const handleUpdateProduct = async (data: any) => {
    try {
      await apiService.updateProduct(editingItem.id, data)
      await loadData()
      setSnackbar({ open: true, message: 'Product updated successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update product', severity: 'error' })
    }
  }

  const handleDeleteProduct = async () => {
    try {
      await apiService.deleteProduct(itemToDelete.id)
      await loadData()
      setSnackbar({ open: true, message: 'Product deleted successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete product', severity: 'error' })
    }
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  // CRUD handlers for Categories
  const handleCreateCategory = async (data: any) => {
    try {
      // await apiService.createCategory(data)
      await loadData()
      setSnackbar({ open: true, message: 'Category created successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create category', severity: 'error' })
    }
  }

  // CRUD handlers for Stock Movements
  const handleCreateStockMovement = async (data: any) => {
    try {
      // await apiService.createStockMovement(data)
      await loadData()
      setSnackbar({ open: true, message: 'Stock movement recorded successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to record stock movement', severity: 'error' })
    }
  }

  // Generic handlers
  const handleEdit = (item: any) => {
    setEditingItem(item)
    if (tabValue === 0) setProductFormOpen(true)
    else if (tabValue === 1) setCategoryFormOpen(true)
    else if (tabValue === 2) setStockMovementFormOpen(true)
  }

  const handleDelete = (item: any) => {
    setItemToDelete(item)
    setDeleteType(tabValue === 0 ? 'product' : tabValue === 1 ? 'category' : 'movement')
    setDeleteDialogOpen(true)
  }

  const handleView = (item: any) => {
    console.log('View item:', item)
    // Implement view functionality
  }

  const handlePrint = (items: any[]) => {
    const currentColumns = tabValue === 0 ? productColumns : tabValue === 1 ? categoryColumns : stockMovementColumns
    const title = `Inventory ${tabValue === 0 ? 'Products' : tabValue === 1 ? 'Categories' : 'Stock Movements'} Report`
    PrintUtils.printTable(items, currentColumns, title)
  }

  const handleExport = (items: any[]) => {
    const currentColumns = tabValue === 0 ? productColumns : tabValue === 1 ? categoryColumns : stockMovementColumns
    const filename = `inventory_${tabValue === 0 ? 'products' : tabValue === 1 ? 'categories' : 'movements'}_${new Date().toISOString().split('T')[0]}`
    ExportUtils.exportToCSV(items, currentColumns, filename)
  }

  // Calculate stats
  const totalProducts = products.length
  const lowStockProducts = products.filter(p => p.stock <= (p.minStock || 0)).length
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock || 0), 0)
  const totalCategories = categories.length

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Inventory Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage products, categories, and stock movements
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Inventory />
                </Avatar>
                <Box>
                  <Typography variant="h6">{totalProducts}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Products</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Warning />
                </Avatar>
                <Box>
                  <Typography variant="h6" color={lowStockProducts > 0 ? 'error.main' : 'text.primary'}>
                    {lowStockProducts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Low Stock Items</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6">${totalValue.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Value</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <Category />
                </Avatar>
                <Box>
                  <Typography variant="h6">{totalCategories}</Typography>
                  <Typography variant="body2" color="text.secondary">Categories</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Products" />
          <Tab label="Categories" />
          <Tab label="Stock Movements" />
        </Tabs>

        {/* Products Tab */}
        <TabPanel value={tabValue} index={0}>
          <DataTable
            title="Products"
            columns={productColumns}
            data={products}
            loading={loading}
            error={error}
            onAdd={() => setProductFormOpen(true)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
            onExport={handleExport}
            onRefresh={loadData}
            selectable
          />
        </TabPanel>

        {/* Categories Tab */}
        <TabPanel value={tabValue} index={1}>
          <DataTable
            title="Categories"
            columns={categoryColumns}
            data={categories}
            loading={loading}
            error={error}
            onAdd={() => setCategoryFormOpen(true)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
            onExport={handleExport}
            onRefresh={loadData}
            selectable
          />
        </TabPanel>

        {/* Stock Movements Tab */}
        <TabPanel value={tabValue} index={2}>
          <DataTable
            title="Stock Movements"
            columns={stockMovementColumns}
            data={stockMovements}
            loading={loading}
            error={error}
            onAdd={() => setStockMovementFormOpen(true)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
            onExport={handleExport}
            onRefresh={loadData}
            selectable
          />
        </TabPanel>
      </Paper>

      {/* Forms */}
      <ProductForm
        open={productFormOpen}
        onClose={() => {
          setProductFormOpen(false)
          setEditingItem(null)
        }}
        onSubmit={editingItem ? handleUpdateProduct : handleCreateProduct}
        initialData={editingItem}
        title={editingItem ? 'Edit Product' : 'Add New Product'}
      />

      <CategoryForm
        open={categoryFormOpen}
        onClose={() => {
          setCategoryFormOpen(false)
          setEditingItem(null)
        }}
        onSubmit={editingItem ? handleCreateCategory : handleCreateCategory}
        initialData={editingItem}
        mode={editingItem ? 'edit' : 'create'}
      />

      <StockMovementForm
        open={stockMovementFormOpen}
        onClose={() => {
          setStockMovementFormOpen(false)
          setEditingItem(null)
        }}
        onSubmit={editingItem ? handleCreateStockMovement : handleCreateStockMovement}
        initialData={editingItem}
        mode={editingItem ? 'edit' : 'create'}
        products={products}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteProduct}
        itemName={itemToDelete?.name || 'item'}
        itemType={deleteType}
      />

      {/* Snackbar */}
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

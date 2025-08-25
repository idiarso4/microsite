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
  ShoppingCart,
  LocalShipping,
  Assignment,
  TrendingUp,
  Warning,
  CheckCircle,
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Print,
  Download,
  Cancel,
  Pending
} from '@mui/icons-material'
import { 
  DataTable, 
  Column, 
  DeleteConfirmDialog, 
  PrintExportMenu,
  PrintUtils,
  ExportUtils
} from '../common'

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
      id={`orders-tabpanel-${index}`}
      aria-labelledby={`orders-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function OrdersPageNew() {
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Data states
  const [salesOrders, setSalesOrders] = useState<any[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])
  const [shipments, setShipments] = useState<any[]>([])
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<any>(null)
  const [deleteType, setDeleteType] = useState<'sales' | 'purchase' | 'shipment'>('sales')
  
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
      // Mock data for Orders
      setSalesOrders([
        {
          id: 1,
          orderNumber: 'SO2024-001',
          customerName: 'ABC Company',
          orderDate: '2024-01-15',
          dueDate: '2024-01-25',
          status: 'confirmed',
          totalAmount: 150000,
          items: 5
        },
        {
          id: 2,
          orderNumber: 'SO2024-002',
          customerName: 'XYZ Corp',
          orderDate: '2024-01-16',
          dueDate: '2024-01-30',
          status: 'pending',
          totalAmount: 250000,
          items: 8
        }
      ])

      setPurchaseOrders([
        {
          id: 1,
          orderNumber: 'PO2024-001',
          vendorName: 'Supplier ABC',
          orderDate: '2024-01-10',
          expectedDate: '2024-01-20',
          status: 'approved',
          totalAmount: 75000,
          items: 3
        },
        {
          id: 2,
          orderNumber: 'PO2024-002',
          vendorName: 'Vendor XYZ',
          orderDate: '2024-01-12',
          expectedDate: '2024-01-22',
          status: 'pending',
          totalAmount: 120000,
          items: 6
        }
      ])

      setShipments([
        {
          id: 1,
          shipmentNumber: 'SH2024-001',
          orderNumber: 'SO2024-001',
          customerName: 'ABC Company',
          shipDate: '2024-01-18',
          trackingNumber: 'TRK123456789',
          status: 'shipped',
          carrier: 'DHL Express'
        },
        {
          id: 2,
          shipmentNumber: 'SH2024-002',
          orderNumber: 'SO2024-002',
          customerName: 'XYZ Corp',
          shipDate: '2024-01-20',
          trackingNumber: 'TRK987654321',
          status: 'delivered',
          carrier: 'FedEx'
        }
      ])
    } catch (err) {
      setError('Failed to load orders data')
      console.error('Error loading orders data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Sales Order columns
  const salesOrderColumns: Column[] = [
    { id: 'orderNumber', label: 'Order #', minWidth: 140, filterable: true },
    { 
      id: 'customerName', 
      label: 'Customer', 
      minWidth: 180,
      filterable: true,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            <ShoppingCart />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold">{value}</Typography>
            <Typography variant="caption" color="text.secondary">
              {row.items} items
            </Typography>
          </Box>
        </Box>
      )
    },
    { 
      id: 'orderDate', 
      label: 'Order Date', 
      minWidth: 120,
      format: (value) => new Date(value).toLocaleDateString()
    },
    { 
      id: 'dueDate', 
      label: 'Due Date', 
      minWidth: 120,
      format: (value) => new Date(value).toLocaleDateString()
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      format: (value) => {
        const config = {
          pending: { label: 'Pending', color: 'warning', icon: <Pending /> },
          confirmed: { label: 'Confirmed', color: 'info', icon: <CheckCircle /> },
          shipped: { label: 'Shipped', color: 'primary', icon: <LocalShipping /> },
          delivered: { label: 'Delivered', color: 'success', icon: <CheckCircle /> },
          cancelled: { label: 'Cancelled', color: 'error', icon: <Cancel /> }
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
      id: 'totalAmount', 
      label: 'Total Amount', 
      minWidth: 140,
      align: 'right',
      format: (value) => `IDR ${value?.toLocaleString() || 0}`
    }
  ]

  // Purchase Order columns
  const purchaseOrderColumns: Column[] = [
    { id: 'orderNumber', label: 'PO #', minWidth: 140, filterable: true },
    { id: 'vendorName', label: 'Vendor', minWidth: 180, filterable: true },
    { 
      id: 'orderDate', 
      label: 'Order Date', 
      minWidth: 120,
      format: (value) => new Date(value).toLocaleDateString()
    },
    { 
      id: 'expectedDate', 
      label: 'Expected Date', 
      minWidth: 120,
      format: (value) => new Date(value).toLocaleDateString()
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      format: (value) => {
        const colors = { 
          pending: 'warning', 
          approved: 'success', 
          received: 'info',
          cancelled: 'error' 
        }
        return (
          <Chip
            label={value?.toUpperCase()}
            color={colors[value as keyof typeof colors] as any}
            size="small"
          />
        )
      }
    },
    { 
      id: 'totalAmount', 
      label: 'Total Amount', 
      minWidth: 140,
      align: 'right',
      format: (value) => `IDR ${value?.toLocaleString() || 0}`
    }
  ]

  // Shipment columns
  const shipmentColumns: Column[] = [
    { id: 'shipmentNumber', label: 'Shipment #', minWidth: 140, filterable: true },
    { id: 'orderNumber', label: 'Order #', minWidth: 120, filterable: true },
    { id: 'customerName', label: 'Customer', minWidth: 180, filterable: true },
    { 
      id: 'shipDate', 
      label: 'Ship Date', 
      minWidth: 120,
      format: (value) => new Date(value).toLocaleDateString()
    },
    { id: 'trackingNumber', label: 'Tracking #', minWidth: 140, filterable: true },
    { id: 'carrier', label: 'Carrier', minWidth: 120, filterable: true },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      format: (value) => {
        const colors = { 
          preparing: 'default',
          shipped: 'warning', 
          in_transit: 'info',
          delivered: 'success',
          returned: 'error' 
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

  // Generic handlers
  const handleEdit = (item: any) => {
    console.log('Edit item:', item)
    // Implement edit functionality
  }

  const handleDelete = (item: any) => {
    setItemToDelete(item)
    setDeleteType(tabValue === 0 ? 'sales' : tabValue === 1 ? 'purchase' : 'shipment')
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      // await apiService.deleteItem(itemToDelete.id)
      await loadData()
      setSnackbar({ open: true, message: `${deleteType} order deleted successfully`, severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: `Failed to delete ${deleteType} order`, severity: 'error' })
    }
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const handleView = (item: any) => {
    console.log('View item:', item)
    // Implement view functionality
  }

  const handlePrint = (items: any[]) => {
    const currentColumns = tabValue === 0 ? salesOrderColumns : tabValue === 1 ? purchaseOrderColumns : shipmentColumns
    const title = `${tabValue === 0 ? 'Sales Orders' : tabValue === 1 ? 'Purchase Orders' : 'Shipments'} Report`
    PrintUtils.printTable(items, currentColumns, title)
  }

  const handleExport = (items: any[]) => {
    const currentColumns = tabValue === 0 ? salesOrderColumns : tabValue === 1 ? purchaseOrderColumns : shipmentColumns
    const filename = `${tabValue === 0 ? 'sales_orders' : tabValue === 1 ? 'purchase_orders' : 'shipments'}_${new Date().toISOString().split('T')[0]}`
    ExportUtils.exportToCSV(items, currentColumns, filename)
  }

  // Calculate stats
  const totalSalesOrders = salesOrders.length
  const pendingSalesOrders = salesOrders.filter(so => so.status === 'pending').length
  const totalPurchaseOrders = purchaseOrders.length
  const pendingShipments = shipments.filter(sh => sh.status === 'shipped').length

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Orders & Fulfillment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage sales orders, purchase orders, and shipments
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
                  <ShoppingCart />
                </Avatar>
                <Box>
                  <Typography variant="h6">{totalSalesOrders}</Typography>
                  <Typography variant="body2" color="text.secondary">Sales Orders</Typography>
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
                  <Pending />
                </Avatar>
                <Box>
                  <Typography variant="h6">{pendingSalesOrders}</Typography>
                  <Typography variant="body2" color="text.secondary">Pending Sales</Typography>
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
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h6">{totalPurchaseOrders}</Typography>
                  <Typography variant="body2" color="text.secondary">Purchase Orders</Typography>
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
                  <LocalShipping />
                </Avatar>
                <Box>
                  <Typography variant="h6">{pendingShipments}</Typography>
                  <Typography variant="body2" color="text.secondary">Active Shipments</Typography>
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
          <Tab label="Sales Orders" />
          <Tab label="Purchase Orders" />
          <Tab label="Shipments" />
        </Tabs>

        {/* Sales Orders Tab */}
        <TabPanel value={tabValue} index={0}>
          <DataTable
            title="Sales Orders"
            columns={salesOrderColumns}
            data={salesOrders}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
            onExport={handleExport}
            onRefresh={loadData}
            selectable
          />
        </TabPanel>

        {/* Purchase Orders Tab */}
        <TabPanel value={tabValue} index={1}>
          <DataTable
            title="Purchase Orders"
            columns={purchaseOrderColumns}
            data={purchaseOrders}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
            onExport={handleExport}
            onRefresh={loadData}
            selectable
          />
        </TabPanel>

        {/* Shipments Tab */}
        <TabPanel value={tabValue} index={2}>
          <DataTable
            title="Shipments"
            columns={shipmentColumns}
            data={shipments}
            loading={loading}
            error={error}
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

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete?.orderNumber || itemToDelete?.shipmentNumber || 'item'}
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

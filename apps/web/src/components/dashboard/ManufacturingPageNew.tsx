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
  Assignment,
  Factory,
  VerifiedUser,
  Schedule,
  TrendingUp,
  Warning,
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Print,
  Download,
  CheckCircle,
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
import WorkOrderForm from '../forms/WorkOrderForm'
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
      id={`manufacturing-tabpanel-${index}`}
      aria-labelledby={`manufacturing-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function ManufacturingPageNew() {
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Data states
  const [workOrders, setWorkOrders] = useState<any[]>([])
  const [bomItems, setBomItems] = useState<any[]>([])
  const [qualityChecks, setQualityChecks] = useState<any[]>([])
  
  // Form states
  const [workOrderFormOpen, setWorkOrderFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<any>(null)
  const [deleteType, setDeleteType] = useState<'workorder' | 'bom' | 'quality'>('workorder')
  
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
      // Mock data for Manufacturing
      setWorkOrders([
        {
          id: 1,
          workOrderNumber: 'WO2024-001',
          productName: 'Laptop Assembly',
          quantity: 50,
          startDate: '2024-01-15',
          dueDate: '2024-01-25',
          priority: 'high',
          status: 'in_progress',
          assignedToName: 'John Doe',
          workCenterName: 'Assembly Line 1',
          estimatedHours: 100,
          actualHours: 45
        },
        {
          id: 2,
          workOrderNumber: 'WO2024-002',
          productName: 'Smartphone Case',
          quantity: 200,
          startDate: '2024-01-20',
          dueDate: '2024-01-30',
          priority: 'medium',
          status: 'planned',
          assignedToName: 'Jane Smith',
          workCenterName: 'Molding Station',
          estimatedHours: 80,
          actualHours: 0
        }
      ])

      setBomItems([
        {
          id: 1,
          productName: 'Laptop Assembly',
          componentName: 'CPU Intel i7',
          quantity: 1,
          unit: 'pcs',
          cost: 300,
          supplier: 'Intel Corp'
        },
        {
          id: 2,
          productName: 'Laptop Assembly',
          componentName: 'RAM 16GB',
          quantity: 2,
          unit: 'pcs',
          cost: 150,
          supplier: 'Samsung'
        }
      ])

      setQualityChecks([
        {
          id: 1,
          workOrderNumber: 'WO2024-001',
          checkType: 'incoming',
          itemName: 'CPU Intel i7',
          status: 'passed',
          checkedBy: 'QC Inspector 1',
          checkDate: '2024-01-15',
          notes: 'All specifications met'
        },
        {
          id: 2,
          workOrderNumber: 'WO2024-001',
          checkType: 'in_process',
          itemName: 'Assembly Progress',
          status: 'pending',
          checkedBy: 'QC Inspector 2',
          checkDate: '2024-01-18',
          notes: 'Scheduled for inspection'
        }
      ])
    } catch (err) {
      setError('Failed to load manufacturing data')
      console.error('Error loading manufacturing data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Work Order columns
  const workOrderColumns: Column[] = [
    { id: 'workOrderNumber', label: 'Work Order #', minWidth: 140, filterable: true },
    { 
      id: 'productName', 
      label: 'Product', 
      minWidth: 180,
      filterable: true,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            <Factory />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold">{value}</Typography>
            <Typography variant="caption" color="text.secondary">
              Qty: {row.quantity}
            </Typography>
          </Box>
        </Box>
      )
    },
    { 
      id: 'priority', 
      label: 'Priority', 
      minWidth: 100,
      format: (value) => {
        const colors = {
          low: '#4caf50',
          medium: '#ff9800',
          high: '#f44336',
          urgent: '#9c27b0'
        }
        return (
          <Chip
            label={value?.toUpperCase()}
            size="small"
            sx={{
              backgroundColor: colors[value as keyof typeof colors] || '#757575',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        )
      }
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      format: (value) => {
        const config = {
          planned: { label: 'Planned', color: 'default', icon: <Schedule /> },
          in_progress: { label: 'In Progress', color: 'warning', icon: <Pending /> },
          completed: { label: 'Completed', color: 'success', icon: <CheckCircle /> },
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
      id: 'dueDate', 
      label: 'Due Date', 
      minWidth: 120,
      format: (value) => new Date(value).toLocaleDateString()
    },
    { id: 'assignedToName', label: 'Assigned To', minWidth: 140, filterable: true },
    { id: 'workCenterName', label: 'Work Center', minWidth: 140, filterable: true },
    { 
      id: 'progress', 
      label: 'Progress', 
      minWidth: 120,
      format: (value, row) => {
        const progress = row.estimatedHours > 0 ? (row.actualHours / row.estimatedHours) * 100 : 0
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(progress, 100)} 
              sx={{ width: 60, height: 6 }}
            />
            <Typography variant="caption">
              {Math.round(progress)}%
            </Typography>
          </Box>
        )
      }
    }
  ]

  // BOM columns
  const bomColumns: Column[] = [
    { id: 'productName', label: 'Product', minWidth: 150, filterable: true },
    { id: 'componentName', label: 'Component', minWidth: 180, filterable: true },
    { 
      id: 'quantity', 
      label: 'Quantity', 
      minWidth: 100,
      align: 'center',
      format: (value, row) => `${value} ${row.unit}`
    },
    { 
      id: 'cost', 
      label: 'Unit Cost', 
      minWidth: 120,
      align: 'right',
      format: (value) => `$${value?.toFixed(2) || '0.00'}`
    },
    { 
      id: 'totalCost', 
      label: 'Total Cost', 
      minWidth: 120,
      align: 'right',
      format: (value, row) => `$${(row.quantity * row.cost).toFixed(2)}`
    },
    { id: 'supplier', label: 'Supplier', minWidth: 140, filterable: true }
  ]

  // Quality Check columns
  const qualityColumns: Column[] = [
    { id: 'workOrderNumber', label: 'Work Order', minWidth: 140, filterable: true },
    { 
      id: 'checkType', 
      label: 'Check Type', 
      minWidth: 120,
      format: (value) => (
        <Chip
          label={value?.replace('_', ' ').toUpperCase()}
          variant="outlined"
          size="small"
        />
      )
    },
    { id: 'itemName', label: 'Item', minWidth: 150, filterable: true },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 100,
      format: (value) => {
        const colors = { 
          passed: 'success', 
          failed: 'error', 
          pending: 'warning' 
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
      id: 'checkDate', 
      label: 'Check Date', 
      minWidth: 120,
      format: (value) => new Date(value).toLocaleDateString()
    },
    { id: 'checkedBy', label: 'Checked By', minWidth: 140, filterable: true },
    { id: 'notes', label: 'Notes', minWidth: 200 }
  ]

  // CRUD handlers
  const handleCreateWorkOrder = async (data: any) => {
    try {
      // await apiService.createWorkOrder(data)
      await loadData()
      setSnackbar({ open: true, message: 'Work order created successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create work order', severity: 'error' })
    }
  }

  // Generic handlers
  const handleEdit = (item: any) => {
    setEditingItem(item)
    if (tabValue === 0) setWorkOrderFormOpen(true)
  }

  const handleDelete = (item: any) => {
    setItemToDelete(item)
    setDeleteType(tabValue === 0 ? 'workorder' : tabValue === 1 ? 'bom' : 'quality')
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      // await apiService.deleteItem(itemToDelete.id)
      await loadData()
      setSnackbar({ open: true, message: `${deleteType} deleted successfully`, severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: `Failed to delete ${deleteType}`, severity: 'error' })
    }
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const handleView = (item: any) => {
    console.log('View item:', item)
    // Implement view functionality
  }

  const handlePrint = (items: any[]) => {
    const currentColumns = tabValue === 0 ? workOrderColumns : tabValue === 1 ? bomColumns : qualityColumns
    const title = `Manufacturing ${tabValue === 0 ? 'Work Orders' : tabValue === 1 ? 'Bill of Materials' : 'Quality Checks'} Report`
    PrintUtils.printTable(items, currentColumns, title)
  }

  const handleExport = (items: any[]) => {
    const currentColumns = tabValue === 0 ? workOrderColumns : tabValue === 1 ? bomColumns : qualityColumns
    const filename = `manufacturing_${tabValue === 0 ? 'work_orders' : tabValue === 1 ? 'bom' : 'quality_checks'}_${new Date().toISOString().split('T')[0]}`
    ExportUtils.exportToCSV(items, currentColumns, filename)
  }

  // Calculate stats
  const totalWorkOrders = workOrders.length
  const inProgressOrders = workOrders.filter(wo => wo.status === 'in_progress').length
  const completedOrders = workOrders.filter(wo => wo.status === 'completed').length
  const pendingQualityChecks = qualityChecks.filter(qc => qc.status === 'pending').length

  // Mock data for forms
  const products = [
    { id: 1, name: 'Laptop Assembly', sku: 'LAP001' },
    { id: 2, name: 'Smartphone Case', sku: 'PHN001' }
  ]

  const employees = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
  ]

  const workCenters = [
    { id: 1, name: 'Assembly Line 1' },
    { id: 2, name: 'Molding Station' }
  ]

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Manufacturing
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage work orders, bill of materials, and quality control
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
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h6">{totalWorkOrders}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Work Orders</Typography>
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
                  <Typography variant="h6">{inProgressOrders}</Typography>
                  <Typography variant="body2" color="text.secondary">In Progress</Typography>
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
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h6">{completedOrders}</Typography>
                  <Typography variant="body2" color="text.secondary">Completed</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <Warning />
                </Avatar>
                <Box>
                  <Typography variant="h6" color={pendingQualityChecks > 0 ? 'error.main' : 'text.primary'}>
                    {pendingQualityChecks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Pending QC</Typography>
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
          <Tab label="Work Orders" />
          <Tab label="Bill of Materials" />
          <Tab label="Quality Control" />
        </Tabs>

        {/* Work Orders Tab */}
        <TabPanel value={tabValue} index={0}>
          <DataTable
            title="Work Orders"
            columns={workOrderColumns}
            data={workOrders}
            loading={loading}
            error={error}
            onAdd={() => setWorkOrderFormOpen(true)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
            onExport={handleExport}
            onRefresh={loadData}
            selectable
          />
        </TabPanel>

        {/* Bill of Materials Tab */}
        <TabPanel value={tabValue} index={1}>
          <DataTable
            title="Bill of Materials"
            columns={bomColumns}
            data={bomItems}
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

        {/* Quality Control Tab */}
        <TabPanel value={tabValue} index={2}>
          <DataTable
            title="Quality Control Checks"
            columns={qualityColumns}
            data={qualityChecks}
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

      {/* Forms */}
      <WorkOrderForm
        open={workOrderFormOpen}
        onClose={() => {
          setWorkOrderFormOpen(false)
          setEditingItem(null)
        }}
        onSubmit={editingItem ? handleCreateWorkOrder : handleCreateWorkOrder}
        initialData={editingItem}
        mode={editingItem ? 'edit' : 'create'}
        products={products}
        employees={employees}
        workCenters={workCenters}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete?.workOrderNumber || itemToDelete?.componentName || itemToDelete?.itemName || 'item'}
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

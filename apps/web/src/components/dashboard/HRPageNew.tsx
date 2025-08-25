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
  People,
  Business,
  BeachAccess,
  AccessTime,
  MonetizationOn,
  TrendingUp,
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
import EmployeeForm from '../forms/EmployeeForm'
import DepartmentForm from '../forms/DepartmentForm'
import LeaveRequestForm from '../forms/LeaveRequestForm'
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
      id={`hr-tabpanel-${index}`}
      aria-labelledby={`hr-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function HRPageNew() {
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Data states
  const [employees, setEmployees] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [leaveRequests, setLeaveRequests] = useState<any[]>([])
  
  // Form states
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false)
  const [departmentFormOpen, setDepartmentFormOpen] = useState(false)
  const [leaveFormOpen, setLeaveFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'approve'>('create')
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<any>(null)
  const [deleteType, setDeleteType] = useState<'employee' | 'department' | 'leave'>('employee')
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  })

  // Mock current user
  const currentUser = { id: 1, name: 'John Doe', role: 'manager' }

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Mock data for HR
      setEmployees([
        {
          id: 1,
          employeeId: 'EMP001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@company.com',
          phone: '+1234567890',
          position: 'Software Engineer',
          departmentName: 'Engineering',
          hireDate: '2023-01-15',
          salary: 75000,
          status: 'active'
        },
        {
          id: 2,
          employeeId: 'EMP002',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@company.com',
          phone: '+1234567891',
          position: 'Product Manager',
          departmentName: 'Product',
          hireDate: '2022-06-01',
          salary: 85000,
          status: 'active'
        }
      ])

      setDepartments([
        {
          id: 1,
          name: 'Engineering',
          code: 'ENG',
          managerName: 'John Doe',
          location: 'Building A',
          employeeCount: 15,
          budget: 500000,
          isActive: true
        },
        {
          id: 2,
          name: 'Product',
          code: 'PROD',
          managerName: 'Jane Smith',
          location: 'Building B',
          employeeCount: 8,
          budget: 300000,
          isActive: true
        }
      ])

      setLeaveRequests([
        {
          id: 1,
          employeeName: 'John Doe',
          leaveType: 'annual',
          startDate: '2024-02-01',
          endDate: '2024-02-05',
          totalDays: 5,
          reason: 'Family vacation',
          status: 'pending'
        },
        {
          id: 2,
          employeeName: 'Jane Smith',
          leaveType: 'sick',
          startDate: '2024-01-20',
          endDate: '2024-01-22',
          totalDays: 3,
          reason: 'Medical appointment',
          status: 'approved',
          approverName: 'HR Manager'
        }
      ])
    } catch (err) {
      setError('Failed to load HR data')
      console.error('Error loading HR data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Employee columns
  const employeeColumns: Column[] = [
    { 
      id: 'name', 
      label: 'Employee', 
      minWidth: 200,
      filterable: true,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {row.firstName?.charAt(0)}{row.lastName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {row.firstName} {row.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.employeeId}
            </Typography>
          </Box>
        </Box>
      )
    },
    { id: 'email', label: 'Email', minWidth: 180, filterable: true },
    { id: 'position', label: 'Position', minWidth: 140, filterable: true },
    { id: 'departmentName', label: 'Department', minWidth: 120, filterable: true },
    { 
      id: 'hireDate', 
      label: 'Hire Date', 
      minWidth: 120,
      format: (value) => new Date(value).toLocaleDateString()
    },
    { 
      id: 'salary', 
      label: 'Salary', 
      minWidth: 120,
      align: 'right',
      format: (value) => `$${value?.toLocaleString() || 0}`
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 100,
      format: (value) => {
        const colors = { 
          active: 'success', 
          inactive: 'warning', 
          terminated: 'error' 
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

  // Department columns
  const departmentColumns: Column[] = [
    { 
      id: 'name', 
      label: 'Department', 
      minWidth: 180,
      filterable: true,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
            <Business />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold">{value}</Typography>
            <Typography variant="caption" color="text.secondary">
              Code: {row.code}
            </Typography>
          </Box>
        </Box>
      )
    },
    { id: 'managerName', label: 'Manager', minWidth: 140, filterable: true },
    { id: 'location', label: 'Location', minWidth: 120 },
    { 
      id: 'employeeCount', 
      label: 'Employees', 
      minWidth: 100,
      align: 'center',
      format: (value) => (
        <Chip label={value || 0} variant="outlined" size="small" />
      )
    },
    { 
      id: 'budget', 
      label: 'Budget', 
      minWidth: 120,
      align: 'right',
      format: (value) => `$${value?.toLocaleString() || 0}`
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

  // Leave Request columns
  const leaveColumns: Column[] = [
    { id: 'employeeName', label: 'Employee', minWidth: 150, filterable: true },
    { 
      id: 'leaveType', 
      label: 'Type', 
      minWidth: 120,
      format: (value) => {
        const colors = {
          annual: '#4caf50',
          sick: '#f44336',
          maternity: '#e91e63',
          paternity: '#2196f3',
          emergency: '#ff9800'
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
      id: 'startDate', 
      label: 'Start Date', 
      minWidth: 120,
      format: (value) => new Date(value).toLocaleDateString()
    },
    { 
      id: 'endDate', 
      label: 'End Date', 
      minWidth: 120,
      format: (value) => new Date(value).toLocaleDateString()
    },
    { 
      id: 'totalDays', 
      label: 'Days', 
      minWidth: 80,
      align: 'center'
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      format: (value) => {
        const config = {
          pending: { label: 'Pending', color: 'warning', icon: <Pending /> },
          approved: { label: 'Approved', color: 'success', icon: <CheckCircle /> },
          rejected: { label: 'Rejected', color: 'error', icon: <Cancel /> }
        }
        const item = config[value as keyof typeof config]
        return item ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {item.icon}
            <Chip label={item.label} color={item.color as any} size="small" />
          </Box>
        ) : value
      }
    }
  ]

  // CRUD handlers
  const handleCreateEmployee = async (data: any) => {
    try {
      // await apiService.createEmployee(data)
      await loadData()
      setSnackbar({ open: true, message: 'Employee created successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create employee', severity: 'error' })
    }
  }

  const handleCreateDepartment = async (data: any) => {
    try {
      // await apiService.createDepartment(data)
      await loadData()
      setSnackbar({ open: true, message: 'Department created successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create department', severity: 'error' })
    }
  }

  const handleCreateLeaveRequest = async (data: any) => {
    try {
      // await apiService.createLeaveRequest(data)
      await loadData()
      setSnackbar({ open: true, message: 'Leave request submitted successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to submit leave request', severity: 'error' })
    }
  }

  // Generic handlers
  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormMode('edit')
    if (tabValue === 0) setEmployeeFormOpen(true)
    else if (tabValue === 1) setDepartmentFormOpen(true)
    else if (tabValue === 2) setLeaveFormOpen(true)
  }

  const handleApprove = (item: any) => {
    setEditingItem(item)
    setFormMode('approve')
    setLeaveFormOpen(true)
  }

  const handleDelete = (item: any) => {
    setItemToDelete(item)
    setDeleteType(tabValue === 0 ? 'employee' : tabValue === 1 ? 'department' : 'leave')
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
    const currentColumns = tabValue === 0 ? employeeColumns : tabValue === 1 ? departmentColumns : leaveColumns
    const title = `HR ${tabValue === 0 ? 'Employees' : tabValue === 1 ? 'Departments' : 'Leave Requests'} Report`
    PrintUtils.printTable(items, currentColumns, title)
  }

  const handleExport = (items: any[]) => {
    const currentColumns = tabValue === 0 ? employeeColumns : tabValue === 1 ? departmentColumns : leaveColumns
    const filename = `hr_${tabValue === 0 ? 'employees' : tabValue === 1 ? 'departments' : 'leave_requests'}_${new Date().toISOString().split('T')[0]}`
    ExportUtils.exportToCSV(items, currentColumns, filename)
  }

  // Calculate stats
  const totalEmployees = employees.length
  const activeEmployees = employees.filter(e => e.status === 'active').length
  const totalDepartments = departments.length
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length

  // Custom actions for leave requests
  const leaveCustomActions = [
    {
      icon: <CheckCircle />,
      label: 'Approve',
      onClick: handleApprove,
      color: 'success' as const
    }
  ]

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Human Resources
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage employees, departments, and leave requests
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
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h6">{totalEmployees}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Employees</Typography>
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
                  <Typography variant="h6">{activeEmployees}</Typography>
                  <Typography variant="body2" color="text.secondary">Active Employees</Typography>
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
                  <Business />
                </Avatar>
                <Box>
                  <Typography variant="h6">{totalDepartments}</Typography>
                  <Typography variant="body2" color="text.secondary">Departments</Typography>
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
                  <BeachAccess />
                </Avatar>
                <Box>
                  <Typography variant="h6" color={pendingLeaves > 0 ? 'warning.main' : 'text.primary'}>
                    {pendingLeaves}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Pending Leaves</Typography>
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
          <Tab label="Employees" />
          <Tab label="Departments" />
          <Tab label="Leave Requests" />
        </Tabs>

        {/* Employees Tab */}
        <TabPanel value={tabValue} index={0}>
          <DataTable
            title="Employees"
            columns={employeeColumns}
            data={employees}
            loading={loading}
            error={error}
            onAdd={() => setEmployeeFormOpen(true)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
            onExport={handleExport}
            onRefresh={loadData}
            selectable
          />
        </TabPanel>

        {/* Departments Tab */}
        <TabPanel value={tabValue} index={1}>
          <DataTable
            title="Departments"
            columns={departmentColumns}
            data={departments}
            loading={loading}
            error={error}
            onAdd={() => setDepartmentFormOpen(true)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
            onExport={handleExport}
            onRefresh={loadData}
            selectable
          />
        </TabPanel>

        {/* Leave Requests Tab */}
        <TabPanel value={tabValue} index={2}>
          <DataTable
            title="Leave Requests"
            columns={leaveColumns}
            data={leaveRequests}
            loading={loading}
            error={error}
            onAdd={() => setLeaveFormOpen(true)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
            onExport={handleExport}
            onRefresh={loadData}
            customActions={leaveCustomActions}
            selectable
          />
        </TabPanel>
      </Paper>

      {/* Forms */}
      <EmployeeForm
        open={employeeFormOpen}
        onClose={() => {
          setEmployeeFormOpen(false)
          setEditingItem(null)
          setFormMode('create')
        }}
        onSubmit={editingItem ? handleCreateEmployee : handleCreateEmployee}
        initialData={editingItem}
        mode={formMode}
        departments={departments}
        managers={employees.filter(e => e.position?.includes('Manager'))}
      />

      <DepartmentForm
        open={departmentFormOpen}
        onClose={() => {
          setDepartmentFormOpen(false)
          setEditingItem(null)
          setFormMode('create')
        }}
        onSubmit={editingItem ? handleCreateDepartment : handleCreateDepartment}
        initialData={editingItem}
        mode={formMode}
        managers={employees.filter(e => e.position?.includes('Manager'))}
        parentDepartments={departments}
      />

      <LeaveRequestForm
        open={leaveFormOpen}
        onClose={() => {
          setLeaveFormOpen(false)
          setEditingItem(null)
          setFormMode('create')
        }}
        onSubmit={editingItem ? handleCreateLeaveRequest : handleCreateLeaveRequest}
        initialData={editingItem}
        mode={formMode}
        employees={employees}
        currentUser={currentUser}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete?.name || itemToDelete?.firstName + ' ' + itemToDelete?.lastName || 'item'}
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

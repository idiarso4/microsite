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
  Snackbar,
  Avatar
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  People,
  PersonAdd,
  AttachMoney,
  Work,
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
import EmployeeForm, { EmployeeFormData } from '../forms/EmployeeForm'

export default function HRPage() {
  const [hrData, setHrData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<any>(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchHRData()
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchTerm, departmentFilter, statusFilter])

  const fetchHRData = async () => {
    try {
      setLoading(true)
      const params: any = { limit: 20 }
      if (searchTerm) params.search = searchTerm
      if (departmentFilter) params.department = departmentFilter
      if (statusFilter) params.status = statusFilter

      const data = await apiService.getEmployees(params)
      setHrData(data)
      setError(null)
    } catch (err: any) {
      console.error('Failed to fetch HR data:', err)
      setError(err.message || 'Failed to load HR data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEmployee = async (data: EmployeeFormData) => {
    try {
      await apiService.createEmployee(data)
      setSnackbar({ open: true, message: 'Employee berhasil ditambahkan!', severity: 'success' })
      fetchHRData()
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Gagal menambahkan employee', severity: 'error' })
      throw error
    }
  }

  const handleUpdateEmployee = async (data: EmployeeFormData) => {
    try {
      await apiService.updateEmployee(editingEmployee.id, data)
      setSnackbar({ open: true, message: 'Employee berhasil diperbarui!', severity: 'success' })
      fetchHRData()
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Gagal memperbarui employee', severity: 'error' })
      throw error
    }
  }

  const handleDeleteEmployee = async (employeeId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus employee ini?')) {
      try {
        await apiService.deleteEmployee(employeeId)
        setSnackbar({ open: true, message: 'Employee berhasil dihapus!', severity: 'success' })
        fetchHRData()
      } catch (error: any) {
        setSnackbar({ open: true, message: error.message || 'Gagal menghapus employee', severity: 'error' })
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50'
      case 'inactive': return '#FF9800'
      case 'terminated': return '#f44336'
      default: return '#757575'
    }
  }

  const hrStats = [
    {
      title: 'Total Employees',
      value: (hrData?.pagination?.total || 0).toString(),
      change: '+3.2%',
      trend: 'up',
      icon: <People />,
      color: '#DC143C'
    },
    {
      title: 'Active Employees',
      value: (hrData?.employees?.filter((e: any) => e.status === 'active')?.length || 0).toString(),
      change: '+2.1%',
      trend: 'up',
      icon: <PersonAdd />,
      color: '#4CAF50'
    },
    {
      title: 'Total Payroll',
      value: `Rp ${(hrData?.employees?.reduce((sum: number, e: any) => sum + (e.salary || 0), 0) || 0).toLocaleString()}`,
      change: '+5.8%',
      trend: 'up',
      icon: <AttachMoney />,
      color: '#FF9800'
    },
    {
      title: 'Departments',
      value: new Set(hrData?.employees?.map((e: any) => e.department) || []).size.toString(),
      change: '+1',
      trend: 'up',
      icon: <Work />,
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
            Human Resources 👥
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Kelola karyawan dan data HR dengan mudah
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => window.open('http://localhost:3001/api/employees/export', '_blank')}
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
              setEditingEmployee(null)
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
            Add Employee
          </Button>
        </Box>
      </Box>

      {/* HR Management Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)', color: 'white' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Human Resources Management
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Kelola seluruh aspek SDM dari employee database hingga performance review.
              Sistem HR terintegrasi untuk efisiensi maksimal.
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
                  startIcon={<People />}
                >
                  Employee Database
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
                  startIcon={<AttachMoney />}
                >
                  Payroll
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
                  startIcon={<Work />}
                >
                  Leave Management
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
                  startIcon={<TrendingUp />}
                >
                  Performance
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              HR Features
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <People sx={{ color: '#2196F3' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Employee Database
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Complete employee records
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AttachMoney sx={{ color: '#4CAF50' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Payroll Management
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Salary, benefits, deductions
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Work sx={{ color: '#FF9800' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Leave Management
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Annual, sick, emergency leave
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUp sx={{ color: '#9C27B0' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Performance Reviews
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    KPI tracking & evaluations
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {hrStats.map((stat, index) => (
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

      {/* Employees Table */}
      <Paper sx={{ borderRadius: 2 }}>
        <Box p={3} borderBottom="1px solid #e0e0e0">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Employee Directory
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                size="small"
                placeholder="Search employees..."
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
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  label="Department"
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <MenuItem value="">All Departments</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="terminated">Terminated</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={fetchHRData}
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
                <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Salary</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Hire Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(hrData?.employees || []).map((employee: any) => (
                <TableRow key={employee.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: '#DC143C', width: 40, height: 40 }}>
                        {employee.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {employee.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {employee.employeeId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {employee.position}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {employee.department}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>
                    Rp {employee.salary?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.status}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(employee.status)}15`,
                        color: getStatusColor(employee.status),
                        fontWeight: 'medium',
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(employee.hireDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => {
                          setEditingEmployee(employee)
                          setFormOpen(true)
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
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteEmployee(employee.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Employee Form Dialog */}
      <EmployeeForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingEmployee(null)
        }}
        onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
        initialData={editingEmployee}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
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

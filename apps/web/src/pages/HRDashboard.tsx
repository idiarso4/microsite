import React, { useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import {
  People,
  TrendingUp,
  TrendingDown,
  PersonAdd,
  Schedule,
  Assignment,
  School,
  AttachMoney,
  Add,
  FileDownload,
  Refresh,
  MoreVert,
  Work,
  Event,
  CheckCircle,
  Warning,
  AccessTime,
  Business
} from '@mui/icons-material'

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: React.ReactNode
  color: string
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon, color }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {value}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {changeType === 'increase' ? (
              <TrendingUp sx={{ color: '#4CAF50', fontSize: 16, mr: 0.5 }} />
            ) : (
              <TrendingDown sx={{ color: '#f44336', fontSize: 16, mr: 0.5 }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: changeType === 'increase' ? '#4CAF50' : '#f44336',
                fontWeight: 600
              }}
            >
              {change}
            </Typography>
          </Box>
        </Box>
        <Avatar
          sx={{
            backgroundColor: color,
            width: 56,
            height: 56
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
)

export default function HRDashboard() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const metrics = [
    {
      title: 'Total Employees',
      value: '247',
      change: '+5.2%',
      changeType: 'increase' as const,
      icon: <People />,
      color: '#4CAF50'
    },
    {
      title: 'New Hires',
      value: '12',
      change: '+20.0%',
      changeType: 'increase' as const,
      icon: <PersonAdd />,
      color: '#FF9800'
    },
    {
      title: 'Attendance Rate',
      value: '94.5%',
      change: '+2.1%',
      changeType: 'increase' as const,
      icon: <Schedule />,
      color: '#2196F3'
    },
    {
      title: 'Training Hours',
      value: '1,240',
      change: '+15.3%',
      changeType: 'increase' as const,
      icon: <School />,
      color: '#9C27B0'
    }
  ]

  const recentEmployees = [
    {
      id: 1,
      name: 'Budi Santoso',
      position: 'Software Engineer',
      department: 'IT',
      joinDate: '2024-01-10',
      status: 'Active',
      avatar: 'BS'
    },
    {
      id: 2,
      name: 'Sari Dewi',
      position: 'Marketing Manager',
      department: 'Marketing',
      joinDate: '2024-01-08',
      status: 'Active',
      avatar: 'SD'
    },
    {
      id: 3,
      name: 'Ahmad Rahman',
      position: 'Financial Analyst',
      department: 'Finance',
      joinDate: '2024-01-05',
      status: 'Probation',
      avatar: 'AR'
    },
    {
      id: 4,
      name: 'Lisa Wijaya',
      position: 'HR Specialist',
      department: 'HR',
      joinDate: '2024-01-03',
      status: 'Active',
      avatar: 'LW'
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: 'Monthly Team Meeting',
      type: 'Meeting',
      date: '2024-01-18',
      time: '09:00',
      department: 'All Departments'
    },
    {
      id: 2,
      title: 'New Employee Orientation',
      type: 'Training',
      date: '2024-01-19',
      time: '10:00',
      department: 'HR'
    },
    {
      id: 3,
      title: 'Performance Review Session',
      type: 'Review',
      date: '2024-01-20',
      time: '14:00',
      department: 'Management'
    },
    {
      id: 4,
      title: 'Safety Training Workshop',
      type: 'Training',
      date: '2024-01-22',
      time: '13:00',
      department: 'Operations'
    }
  ]

  const departmentStats = [
    { name: 'IT', employees: 45, percentage: 85 },
    { name: 'Marketing', employees: 32, percentage: 65 },
    { name: 'Finance', employees: 28, percentage: 55 },
    { name: 'Operations', employees: 38, percentage: 75 },
    { name: 'HR', employees: 15, percentage: 30 }
  ]

  const leaveRequests = [
    {
      id: 1,
      employee: 'Budi Santoso',
      type: 'Annual Leave',
      startDate: '2024-01-25',
      endDate: '2024-01-27',
      days: 3,
      status: 'Pending'
    },
    {
      id: 2,
      employee: 'Sari Dewi',
      type: 'Sick Leave',
      startDate: '2024-01-20',
      endDate: '2024-01-20',
      days: 1,
      status: 'Approved'
    },
    {
      id: 3,
      employee: 'Ahmad Rahman',
      type: 'Personal Leave',
      startDate: '2024-01-30',
      endDate: '2024-01-31',
      days: 2,
      status: 'Pending'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#4CAF50'
      case 'Probation': return '#FF9800'
      case 'Inactive': return '#f44336'
      default: return '#757575'
    }
  }

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return '#4CAF50'
      case 'Pending': return '#FF9800'
      case 'Rejected': return '#f44336'
      default: return '#757575'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Meeting': return <Event />
      case 'Training': return <School />
      case 'Review': return <Assignment />
      default: return <Schedule />
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            HR Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your human resources and employee data
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={handleMenuOpen}
          >
            Export Reports
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
              }
            }}
          >
            Add Employee
          </Button>
        </Box>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Employees */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Recent Employees
                </Typography>
                <IconButton size="small">
                  <Refresh />
                </IconButton>
              </Box>
              
              <List>
                {recentEmployees.map((employee, index) => (
                  <React.Fragment key={employee.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            backgroundColor: '#DC143C',
                            width: 40,
                            height: 40
                          }}
                        >
                          {employee.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={employee.name}
                        secondary={`${employee.position} • ${employee.department}`}
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip
                          label={employee.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(employee.status),
                            color: 'white',
                            fontWeight: 600,
                            mb: 0.5
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" display="block">
                          Joined: {employee.joinDate}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < recentEmployees.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Department Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Department Distribution
              </Typography>
              
              <Stack spacing={2}>
                {departmentStats.map((dept, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {dept.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dept.employees} employees
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={dept.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#DC143C',
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Upcoming Events
              </Typography>
              
              <List>
                {upcomingEvents.map((event, index) => (
                  <React.Fragment key={event.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            backgroundColor: '#2196F3',
                            width: 40,
                            height: 40
                          }}
                        >
                          {getEventIcon(event.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={event.title}
                        secondary={`${event.department} • ${event.date} at ${event.time}`}
                      />
                      <Chip
                        label={event.type}
                        size="small"
                        variant="outlined"
                      />
                    </ListItem>
                    {index < upcomingEvents.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Leave Requests */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Recent Leave Requests
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {request.employee}
                          </Typography>
                        </TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {request.days} day{request.days > 1 ? 's' : ''}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {request.startDate} - {request.endDate}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={request.status}
                            size="small"
                            sx={{
                              backgroundColor: getLeaveStatusColor(request.status),
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Export Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <People sx={{ mr: 1 }} />
          Employee Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Schedule sx={{ mr: 1 }} />
          Attendance Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <AttachMoney sx={{ mr: 1 }} />
          Payroll Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <School sx={{ mr: 1 }} />
          Training Report
        </MenuItem>
      </Menu>
    </Box>
  )
}

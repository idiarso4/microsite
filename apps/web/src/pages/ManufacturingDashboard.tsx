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
  Factory,
  TrendingUp,
  TrendingDown,
  Build,
  Assignment,
  Speed,
  Warning,
  CheckCircle,
  Schedule,
  Add,
  FileDownload,
  Refresh,
  MoreVert,
  Inventory,
  Engineering,
  Timeline,
  Settings
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

export default function ManufacturingDashboard() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const metrics = [
    {
      title: 'Production Output',
      value: '1,247',
      change: '+8.5%',
      changeType: 'increase' as const,
      icon: <Factory />,
      color: '#4CAF50'
    },
    {
      title: 'Machine Efficiency',
      value: '87.2%',
      change: '+3.1%',
      changeType: 'increase' as const,
      icon: <Speed />,
      color: '#FF9800'
    },
    {
      title: 'Quality Rate',
      value: '96.8%',
      change: '+1.2%',
      changeType: 'increase' as const,
      icon: <CheckCircle />,
      color: '#2196F3'
    },
    {
      title: 'Active Orders',
      value: '156',
      change: '+12.3%',
      changeType: 'increase' as const,
      icon: <Assignment />,
      color: '#9C27B0'
    }
  ]

  const productionLines = [
    {
      id: 1,
      name: 'Production Line A',
      status: 'Running',
      efficiency: 92,
      output: 245,
      target: 280,
      operator: 'Team Alpha'
    },
    {
      id: 2,
      name: 'Production Line B',
      status: 'Running',
      efficiency: 88,
      output: 198,
      target: 220,
      operator: 'Team Beta'
    },
    {
      id: 3,
      name: 'Production Line C',
      status: 'Maintenance',
      efficiency: 0,
      output: 0,
      target: 200,
      operator: 'Maintenance Team'
    },
    {
      id: 4,
      name: 'Production Line D',
      status: 'Running',
      efficiency: 95,
      output: 312,
      target: 320,
      operator: 'Team Delta'
    }
  ]

  const workOrders = [
    {
      id: 1,
      orderNumber: 'WO-2024-001',
      product: 'Widget Type A',
      quantity: 500,
      completed: 350,
      status: 'In Progress',
      dueDate: '2024-01-20',
      priority: 'High'
    },
    {
      id: 2,
      orderNumber: 'WO-2024-002',
      product: 'Component B',
      quantity: 200,
      completed: 200,
      status: 'Completed',
      dueDate: '2024-01-18',
      priority: 'Medium'
    },
    {
      id: 3,
      orderNumber: 'WO-2024-003',
      product: 'Assembly C',
      quantity: 150,
      completed: 75,
      status: 'In Progress',
      dueDate: '2024-01-25',
      priority: 'Low'
    },
    {
      id: 4,
      orderNumber: 'WO-2024-004',
      product: 'Part D',
      quantity: 800,
      completed: 120,
      status: 'In Progress',
      dueDate: '2024-01-22',
      priority: 'High'
    }
  ]

  const maintenanceAlerts = [
    {
      id: 1,
      machine: 'CNC Machine #3',
      type: 'Scheduled Maintenance',
      priority: 'Medium',
      dueDate: '2024-01-19',
      description: 'Regular maintenance check'
    },
    {
      id: 2,
      machine: 'Conveyor Belt #2',
      type: 'Repair Required',
      priority: 'High',
      dueDate: '2024-01-17',
      description: 'Belt alignment issue'
    },
    {
      id: 3,
      machine: 'Press Machine #1',
      type: 'Inspection',
      priority: 'Low',
      dueDate: '2024-01-24',
      description: 'Safety inspection due'
    }
  ]

  const qualityMetrics = [
    { metric: 'Defect Rate', value: '3.2%', target: '<5%', status: 'Good' },
    { metric: 'First Pass Yield', value: '94.5%', target: '>90%', status: 'Excellent' },
    { metric: 'Rework Rate', value: '2.1%', target: '<3%', status: 'Good' },
    { metric: 'Customer Returns', value: '0.8%', target: '<1%', status: 'Excellent' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running': return '#4CAF50'
      case 'Maintenance': return '#FF9800'
      case 'Stopped': return '#f44336'
      case 'Completed': return '#4CAF50'
      case 'In Progress': return '#2196F3'
      default: return '#757575'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#f44336'
      case 'Medium': return '#FF9800'
      case 'Low': return '#4CAF50'
      default: return '#757575'
    }
  }

  const getQualityStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return '#4CAF50'
      case 'Good': return '#2196F3'
      case 'Warning': return '#FF9800'
      case 'Critical': return '#f44336'
      default: return '#757575'
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Manufacturing Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor production lines, work orders, and quality metrics
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
            New Work Order
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
        {/* Production Lines Status */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Production Lines Status
                </Typography>
                <IconButton size="small">
                  <Refresh />
                </IconButton>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Line</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Efficiency</TableCell>
                      <TableCell>Output/Target</TableCell>
                      <TableCell>Operator</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productionLines.map((line) => (
                      <TableRow key={line.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {line.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={line.status}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(line.status),
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {line.efficiency}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={line.efficiency}
                              sx={{
                                width: 60,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: line.efficiency >= 90 ? '#4CAF50' : line.efficiency >= 70 ? '#FF9800' : '#f44336',
                                  borderRadius: 3
                                }
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {line.output}/{line.target}
                          </Typography>
                        </TableCell>
                        <TableCell>{line.operator}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quality Metrics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Quality Metrics
              </Typography>
              
              <Stack spacing={2}>
                {qualityMetrics.map((metric, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderLeft: `4px solid ${getQualityStatusColor(metric.status)}`
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      {metric.metric}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {metric.value}
                      </Typography>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">
                          Target: {metric.target}
                        </Typography>
                        <Chip
                          label={metric.status}
                          size="small"
                          sx={{
                            backgroundColor: getQualityStatusColor(metric.status),
                            color: 'white',
                            fontSize: '0.7rem',
                            ml: 1
                          }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Work Orders */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Active Work Orders
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order #</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Priority</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workOrders.map((order) => {
                      const progress = (order.completed / order.quantity) * 100
                      return (
                        <TableRow key={order.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                              {order.orderNumber}
                            </Typography>
                          </TableCell>
                          <TableCell>{order.product}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {order.completed}/{order.quantity}
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                  width: 60,
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: '#e0e0e0',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#DC143C',
                                    borderRadius: 3
                                  }
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(order.status),
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell>{order.dueDate}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.priority}
                              size="small"
                              sx={{
                                backgroundColor: getPriorityColor(order.priority),
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Maintenance Alerts */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Maintenance Alerts
              </Typography>
              
              <List>
                {maintenanceAlerts.map((alert, index) => (
                  <React.Fragment key={alert.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            backgroundColor: getPriorityColor(alert.priority),
                            width: 40,
                            height: 40
                          }}
                        >
                          <Build />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={alert.machine}
                        secondary={`${alert.type} • Due: ${alert.dueDate}`}
                      />
                      <Chip
                        label={alert.priority}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(alert.priority),
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </ListItem>
                    {index < maintenanceAlerts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
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
          <Factory sx={{ mr: 1 }} />
          Production Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <CheckCircle sx={{ mr: 1 }} />
          Quality Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Build sx={{ mr: 1 }} />
          Maintenance Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Timeline sx={{ mr: 1 }} />
          Efficiency Report
        </MenuItem>
      </Menu>
    </Box>
  )
}

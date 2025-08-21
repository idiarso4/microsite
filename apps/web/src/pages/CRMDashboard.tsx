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
  Phone,
  Email,
  Event,
  AttachMoney,
  PersonAdd,
  Add,
  FileDownload,
  Refresh,
  MoreVert,
  Business,
  Assignment,
  Schedule,
  CheckCircle,
  Warning
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

export default function CRMDashboard() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const metrics = [
    {
      title: 'Total Customers',
      value: '2,847',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: <People />,
      color: '#4CAF50'
    },
    {
      title: 'Active Leads',
      value: '156',
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: <PersonAdd />,
      color: '#FF9800'
    },
    {
      title: 'Sales Pipeline',
      value: 'Rp 1.2B',
      change: '+18.7%',
      changeType: 'increase' as const,
      icon: <AttachMoney />,
      color: '#2196F3'
    },
    {
      title: 'Conversion Rate',
      value: '24.5%',
      change: '+3.1%',
      changeType: 'increase' as const,
      icon: <TrendingUp />,
      color: '#9C27B0'
    }
  ]

  const recentLeads = [
    {
      id: 1,
      name: 'PT Teknologi Maju',
      contact: 'Budi Santoso',
      email: 'budi@teknologimaju.com',
      phone: '+62 812-3456-7890',
      status: 'Hot',
      value: 'Rp 150M',
      source: 'Website'
    },
    {
      id: 2,
      name: 'CV Digital Solutions',
      contact: 'Sari Dewi',
      email: 'sari@digitalsol.com',
      phone: '+62 813-9876-5432',
      status: 'Warm',
      value: 'Rp 85M',
      source: 'Referral'
    },
    {
      id: 3,
      name: 'PT Inovasi Bisnis',
      contact: 'Ahmad Rahman',
      email: 'ahmad@inovasibisnis.id',
      phone: '+62 821-1234-5678',
      status: 'Cold',
      value: 'Rp 200M',
      source: 'Cold Call'
    },
    {
      id: 4,
      name: 'UD Sukses Mandiri',
      contact: 'Lisa Wijaya',
      email: 'lisa@suksesmandiri.co.id',
      phone: '+62 856-7890-1234',
      status: 'Hot',
      value: 'Rp 120M',
      source: 'Social Media'
    }
  ]

  const upcomingTasks = [
    {
      id: 1,
      title: 'Follow up PT Teknologi Maju',
      type: 'Call',
      dueDate: '2024-01-16',
      priority: 'High',
      customer: 'PT Teknologi Maju'
    },
    {
      id: 2,
      title: 'Send proposal to CV Digital Solutions',
      type: 'Email',
      dueDate: '2024-01-17',
      priority: 'Medium',
      customer: 'CV Digital Solutions'
    },
    {
      id: 3,
      title: 'Demo presentation for PT Inovasi Bisnis',
      type: 'Meeting',
      dueDate: '2024-01-18',
      priority: 'High',
      customer: 'PT Inovasi Bisnis'
    },
    {
      id: 4,
      title: 'Contract negotiation with UD Sukses Mandiri',
      type: 'Meeting',
      dueDate: '2024-01-19',
      priority: 'Medium',
      customer: 'UD Sukses Mandiri'
    }
  ]

  const salesPipeline = [
    { stage: 'Prospecting', count: 45, value: 'Rp 450M', percentage: 85 },
    { stage: 'Qualification', count: 32, value: 'Rp 320M', percentage: 65 },
    { stage: 'Proposal', count: 18, value: 'Rp 180M', percentage: 45 },
    { stage: 'Negotiation', count: 12, value: 'Rp 120M', percentage: 30 },
    { stage: 'Closing', count: 8, value: 'Rp 80M', percentage: 20 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot': return '#f44336'
      case 'Warm': return '#FF9800'
      case 'Cold': return '#2196F3'
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

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'Call': return <Phone />
      case 'Email': return <Email />
      case 'Meeting': return <Event />
      default: return <Assignment />
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            CRM Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your customer relationships and sales pipeline
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
            Add Lead
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
        {/* Recent Leads */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Recent Leads
                </Typography>
                <IconButton size="small">
                  <Refresh />
                </IconButton>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Company</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Source</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentLeads.map((lead) => (
                      <TableRow key={lead.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {lead.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {lead.contact}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                              {lead.email}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {lead.phone}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={lead.status}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(lead.status),
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {lead.value}
                          </Typography>
                        </TableCell>
                        <TableCell>{lead.source}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Sales Pipeline */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Sales Pipeline
              </Typography>
              
              <Stack spacing={2}>
                {salesPipeline.map((stage, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {stage.stage} ({stage.count})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stage.value}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stage.percentage}
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

        {/* Upcoming Tasks */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Upcoming Tasks
              </Typography>
              
              <List>
                {upcomingTasks.map((task, index) => (
                  <React.Fragment key={task.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            backgroundColor: getPriorityColor(task.priority),
                            width: 40,
                            height: 40
                          }}
                        >
                          {getTaskIcon(task.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={task.title}
                        secondary={`${task.customer} • Due: ${task.dueDate}`}
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip
                          label={task.type}
                          size="small"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary" display="block">
                          {task.priority} Priority
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < upcomingTasks.length - 1 && <Divider />}
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
          <People sx={{ mr: 1 }} />
          Customer Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <PersonAdd sx={{ mr: 1 }} />
          Leads Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <AttachMoney sx={{ mr: 1 }} />
          Sales Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Assignment sx={{ mr: 1 }} />
          Activity Report
        </MenuItem>
      </Menu>
    </Box>
  )
}

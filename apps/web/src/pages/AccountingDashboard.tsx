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
  Stack
} from '@mui/material'
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Receipt,
  Payment,
  Assessment,
  MoreVert,
  Add,
  FileDownload,
  Refresh,
  Warning,
  CheckCircle,
  Schedule,
  AttachMoney,
  AccountBalanceWallet,
  CreditCard,
  PieChart
} from '@mui/icons-material'
import { formatCurrency } from '../types/accounting'

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

export default function AccountingDashboard() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const metrics = [
    {
      title: 'Total Revenue',
      value: formatCurrency(125000000),
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: <AttachMoney />,
      color: '#4CAF50'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(85000000),
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: <Payment />,
      color: '#FF9800'
    },
    {
      title: 'Net Profit',
      value: formatCurrency(40000000),
      change: '+18.7%',
      changeType: 'increase' as const,
      icon: <TrendingUp />,
      color: '#2196F3'
    },
    {
      title: 'Cash Balance',
      value: formatCurrency(75000000),
      change: '-5.3%',
      changeType: 'decrease' as const,
      icon: <AccountBalanceWallet />,
      color: '#9C27B0'
    }
  ]

  const recentTransactions = [
    {
      id: 1,
      type: 'Income',
      description: 'Sales Invoice #INV-001',
      amount: 5000000,
      date: '2024-01-15',
      status: 'Completed'
    },
    {
      id: 2,
      type: 'Expense',
      description: 'Office Supplies Purchase',
      amount: -500000,
      date: '2024-01-14',
      status: 'Completed'
    },
    {
      id: 3,
      type: 'Income',
      description: 'Service Revenue',
      amount: 2500000,
      date: '2024-01-13',
      status: 'Pending'
    },
    {
      id: 4,
      type: 'Expense',
      description: 'Utility Bills',
      amount: -750000,
      date: '2024-01-12',
      status: 'Completed'
    }
  ]

  const pendingTasks = [
    {
      id: 1,
      title: 'Review Monthly Financial Report',
      priority: 'High',
      dueDate: '2024-01-20'
    },
    {
      id: 2,
      title: 'Process Vendor Payments',
      priority: 'Medium',
      dueDate: '2024-01-18'
    },
    {
      id: 3,
      title: 'Reconcile Bank Statements',
      priority: 'High',
      dueDate: '2024-01-17'
    },
    {
      id: 4,
      title: 'Update Chart of Accounts',
      priority: 'Low',
      dueDate: '2024-01-25'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#f44336'
      case 'Medium': return '#FF9800'
      case 'Low': return '#4CAF50'
      default: return '#757575'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return '#4CAF50'
      case 'Pending': return '#FF9800'
      case 'Failed': return '#f44336'
      default: return '#757575'
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Accounting Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Overview of your financial performance and key metrics
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
            New Transaction
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
        {/* Recent Transactions */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Recent Transactions
                </Typography>
                <IconButton size="small">
                  <Refresh />
                </IconButton>
              </Box>
              
              <List>
                {recentTransactions.map((transaction, index) => (
                  <React.Fragment key={transaction.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            backgroundColor: transaction.type === 'Income' ? '#4CAF50' : '#f44336',
                            width: 40,
                            height: 40
                          }}
                        >
                          {transaction.type === 'Income' ? <TrendingUp /> : <TrendingDown />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={transaction.description}
                        secondary={`${transaction.date} • ${transaction.type}`}
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 'bold',
                            color: transaction.amount > 0 ? '#4CAF50' : '#f44336'
                          }}
                        >
                          {formatCurrency(Math.abs(transaction.amount))}
                        </Typography>
                        <Chip
                          label={transaction.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(transaction.status),
                            color: 'white',
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                    </ListItem>
                    {index < recentTransactions.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Tasks */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Pending Tasks
              </Typography>
              
              <Stack spacing={2}>
                {pendingTasks.map((task) => (
                  <Paper
                    key={task.id}
                    sx={{
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderLeft: `4px solid ${getPriorityColor(task.priority)}`
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      {task.title}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={task.priority}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(task.priority),
                          color: 'white',
                          fontSize: '0.7rem'
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Due: {task.dueDate}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
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
          <Assessment sx={{ mr: 1 }} />
          Financial Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Receipt sx={{ mr: 1 }} />
          Transaction Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <PieChart sx={{ mr: 1 }} />
          Profit & Loss
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <AccountBalance sx={{ mr: 1 }} />
          Balance Sheet
        </MenuItem>
      </Menu>
    </Box>
  )
}

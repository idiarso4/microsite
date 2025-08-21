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
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  LocalShipping,
  Assignment,
  AttachMoney,
  Business,
  Schedule,
  CheckCircle,
  Warning,
  Add,
  FileDownload,
  Refresh,
  MoreVert,
  Receipt,
  Inventory
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

export default function ProcurementDashboard() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const metrics = [
    {
      title: 'Total Spend',
      value: 'Rp 2.4B',
      change: '+8.5%',
      changeType: 'increase' as const,
      icon: <AttachMoney />,
      color: '#4CAF50'
    },
    {
      title: 'Active POs',
      value: '156',
      change: '+12.3%',
      changeType: 'increase' as const,
      icon: <Assignment />,
      color: '#FF9800'
    },
    {
      title: 'Suppliers',
      value: '89',
      change: '+5.6%',
      changeType: 'increase' as const,
      icon: <Business />,
      color: '#2196F3'
    },
    {
      title: 'On-Time Delivery',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'increase' as const,
      icon: <LocalShipping />,
      color: '#9C27B0'
    }
  ]

  const purchaseOrders = [
    {
      id: 1,
      poNumber: 'PO-2024-001',
      supplier: 'PT Supplier Utama',
      items: 'Office Equipment',
      amount: 'Rp 45,000,000',
      status: 'Pending Approval',
      dueDate: '2024-01-20',
      priority: 'High'
    },
    {
      id: 2,
      poNumber: 'PO-2024-002',
      supplier: 'CV Material Jaya',
      items: 'Raw Materials',
      amount: 'Rp 125,000,000',
      status: 'Approved',
      dueDate: '2024-01-18',
      priority: 'Medium'
    },
    {
      id: 3,
      poNumber: 'PO-2024-003',
      supplier: 'UD Teknologi Maju',
      items: 'IT Equipment',
      amount: 'Rp 85,000,000',
      status: 'Delivered',
      dueDate: '2024-01-15',
      priority: 'Low'
    },
    {
      id: 4,
      poNumber: 'PO-2024-004',
      supplier: 'PT Logistik Prima',
      items: 'Packaging Materials',
      amount: 'Rp 32,000,000',
      status: 'In Transit',
      dueDate: '2024-01-22',
      priority: 'Medium'
    }
  ]

  const topSuppliers = [
    {
      id: 1,
      name: 'PT Supplier Utama',
      totalSpend: 'Rp 450M',
      orders: 45,
      onTimeRate: 96,
      rating: 4.8
    },
    {
      id: 2,
      name: 'CV Material Jaya',
      totalSpend: 'Rp 320M',
      orders: 32,
      onTimeRate: 94,
      rating: 4.6
    },
    {
      id: 3,
      name: 'UD Teknologi Maju',
      totalSpend: 'Rp 280M',
      orders: 28,
      onTimeRate: 92,
      rating: 4.5
    },
    {
      id: 4,
      name: 'PT Logistik Prima',
      totalSpend: 'Rp 195M',
      orders: 24,
      onTimeRate: 98,
      rating: 4.9
    }
  ]

  const pendingApprovals = [
    {
      id: 1,
      type: 'Purchase Request',
      requestor: 'IT Department',
      amount: 'Rp 25,000,000',
      description: 'New laptops for development team',
      submittedDate: '2024-01-14',
      urgency: 'High'
    },
    {
      id: 2,
      type: 'Vendor Registration',
      requestor: 'Procurement Team',
      amount: '-',
      description: 'New supplier for office supplies',
      submittedDate: '2024-01-13',
      urgency: 'Medium'
    },
    {
      id: 3,
      type: 'Contract Amendment',
      requestor: 'Legal Department',
      amount: 'Rp 150,000,000',
      description: 'Extension of maintenance contract',
      submittedDate: '2024-01-12',
      urgency: 'Low'
    }
  ]

  const spendingCategories = [
    { category: 'Raw Materials', amount: 'Rp 850M', percentage: 85 },
    { category: 'IT Equipment', amount: 'Rp 420M', percentage: 65 },
    { category: 'Office Supplies', amount: 'Rp 180M', percentage: 45 },
    { category: 'Services', amount: 'Rp 320M', percentage: 60 },
    { category: 'Utilities', amount: 'Rp 125M', percentage: 30 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return '#4CAF50'
      case 'Pending Approval': return '#FF9800'
      case 'Rejected': return '#f44336'
      case 'Delivered': return '#4CAF50'
      case 'In Transit': return '#2196F3'
      case 'Cancelled': return '#f44336'
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return '#f44336'
      case 'Medium': return '#FF9800'
      case 'Low': return '#4CAF50'
      default: return '#757575'
    }
  }

  const formatCurrency = (amount: string) => {
    return amount
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Procurement Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage purchase orders, suppliers, and procurement processes
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
            New Purchase Order
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
        {/* Purchase Orders */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Recent Purchase Orders
                </Typography>
                <IconButton size="small">
                  <Refresh />
                </IconButton>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>PO Number</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Due Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseOrders.map((po) => (
                      <TableRow key={po.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {po.poNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {po.supplier}
                          </Typography>
                        </TableCell>
                        <TableCell>{po.items}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {po.amount}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={po.status}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(po.status),
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>{po.dueDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Spending by Category */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Spending by Category
              </Typography>
              
              <Stack spacing={2}>
                {spendingCategories.map((category, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {category.category}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.amount}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={category.percentage}
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

        {/* Top Suppliers */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Top Suppliers
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Supplier</TableCell>
                      <TableCell>Total Spend</TableCell>
                      <TableCell>Orders</TableCell>
                      <TableCell>On-Time %</TableCell>
                      <TableCell>Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topSuppliers.map((supplier) => (
                      <TableRow key={supplier.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {supplier.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {supplier.totalSpend}
                          </Typography>
                        </TableCell>
                        <TableCell>{supplier.orders}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {supplier.onTimeRate}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={supplier.rating}
                            size="small"
                            sx={{
                              backgroundColor: supplier.rating >= 4.5 ? '#4CAF50' : supplier.rating >= 4.0 ? '#FF9800' : '#f44336',
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

        {/* Pending Approvals */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Pending Approvals
              </Typography>
              
              <List>
                {pendingApprovals.map((approval, index) => (
                  <React.Fragment key={approval.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            backgroundColor: getUrgencyColor(approval.urgency),
                            width: 40,
                            height: 40
                          }}
                        >
                          <Assignment />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={approval.type}
                        secondary={`${approval.requestor} • ${approval.description}`}
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {approval.amount}
                        </Typography>
                        <Chip
                          label={approval.urgency}
                          size="small"
                          sx={{
                            backgroundColor: getUrgencyColor(approval.urgency),
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>
                    </ListItem>
                    {index < pendingApprovals.length - 1 && <Divider />}
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
          <ShoppingCart sx={{ mr: 1 }} />
          Purchase Orders Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Business sx={{ mr: 1 }} />
          Supplier Performance
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <AttachMoney sx={{ mr: 1 }} />
          Spending Analysis
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Receipt sx={{ mr: 1 }} />
          Invoice Report
        </MenuItem>
      </Menu>
    </Box>
  )
}

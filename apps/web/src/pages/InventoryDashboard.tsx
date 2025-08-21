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
  Inventory,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  LocalShipping,
  Warning,
  CheckCircle,
  Schedule,
  Add,
  FileDownload,
  Refresh,
  MoreVert,
  Category,
  Store,
  Assignment,
  Notifications
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

export default function InventoryDashboard() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const metrics = [
    {
      title: 'Total Products',
      value: '1,247',
      change: '+5.2%',
      changeType: 'increase' as const,
      icon: <Category />,
      color: '#4CAF50'
    },
    {
      title: 'Low Stock Items',
      value: '23',
      change: '-12.1%',
      changeType: 'decrease' as const,
      icon: <Warning />,
      color: '#FF9800'
    },
    {
      title: 'Total Value',
      value: 'Rp 2.5B',
      change: '+8.7%',
      changeType: 'increase' as const,
      icon: <Store />,
      color: '#2196F3'
    },
    {
      title: 'Pending Orders',
      value: '156',
      change: '+15.3%',
      changeType: 'increase' as const,
      icon: <Assignment />,
      color: '#9C27B0'
    }
  ]

  const lowStockItems = [
    {
      id: 1,
      name: 'Laptop Dell Inspiron 15',
      sku: 'LAP-DEL-001',
      currentStock: 5,
      minStock: 10,
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Office Chair Ergonomic',
      sku: 'FUR-CHA-002',
      currentStock: 2,
      minStock: 8,
      category: 'Furniture'
    },
    {
      id: 3,
      name: 'Printer HP LaserJet',
      sku: 'PRI-HP-003',
      currentStock: 1,
      minStock: 5,
      category: 'Electronics'
    },
    {
      id: 4,
      name: 'Whiteboard Marker Set',
      sku: 'STA-MAR-004',
      currentStock: 8,
      minStock: 20,
      category: 'Stationery'
    }
  ]

  const recentMovements = [
    {
      id: 1,
      type: 'IN',
      product: 'Laptop Asus ROG',
      quantity: 25,
      date: '2024-01-15',
      reference: 'PO-001'
    },
    {
      id: 2,
      type: 'OUT',
      product: 'Office Desk Standard',
      quantity: 10,
      date: '2024-01-14',
      reference: 'SO-045'
    },
    {
      id: 3,
      type: 'IN',
      product: 'Smartphone Samsung',
      quantity: 50,
      date: '2024-01-13',
      reference: 'PO-002'
    },
    {
      id: 4,
      type: 'OUT',
      product: 'Monitor 24 inch',
      quantity: 15,
      date: '2024-01-12',
      reference: 'SO-046'
    }
  ]

  const topProducts = [
    { name: 'Laptop Asus ROG', value: 'Rp 450M', percentage: 85 },
    { name: 'Smartphone iPhone', value: 'Rp 320M', percentage: 65 },
    { name: 'Monitor Dell 27"', value: 'Rp 180M', percentage: 45 },
    { name: 'Office Chair Premium', value: 'Rp 125M', percentage: 30 }
  ]

  const getStockStatus = (current: number, min: number) => {
    if (current <= min * 0.5) return { label: 'Critical', color: '#f44336' }
    if (current <= min) return { label: 'Low', color: '#FF9800' }
    return { label: 'Good', color: '#4CAF50' }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Inventory Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor your inventory levels and stock movements
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
            Add Product
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
        {/* Low Stock Alert */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Low Stock Alert
                </Typography>
                <IconButton size="small">
                  <Refresh />
                </IconButton>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="center">Current Stock</TableCell>
                      <TableCell align="center">Min Stock</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockItems.map((item) => {
                      const status = getStockStatus(item.currentStock, item.minStock)
                      return (
                        <TableRow key={item.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {item.sku}
                            </Typography>
                          </TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.currentStock}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{item.minStock}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={status.label}
                              size="small"
                              sx={{
                                backgroundColor: status.color,
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

        {/* Top Products by Value */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Top Products by Value
              </Typography>
              
              <Stack spacing={2}>
                {topProducts.map((product, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.value}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={product.percentage}
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

        {/* Recent Stock Movements */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Recent Stock Movements
              </Typography>
              
              <List>
                {recentMovements.map((movement, index) => (
                  <React.Fragment key={movement.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            backgroundColor: movement.type === 'IN' ? '#4CAF50' : '#f44336',
                            width: 40,
                            height: 40
                          }}
                        >
                          {movement.type === 'IN' ? <TrendingUp /> : <TrendingDown />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={movement.product}
                        secondary={`${movement.date} • Ref: ${movement.reference}`}
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 'bold',
                            color: movement.type === 'IN' ? '#4CAF50' : '#f44336'
                          }}
                        >
                          {movement.type === 'IN' ? '+' : '-'}{movement.quantity}
                        </Typography>
                        <Chip
                          label={movement.type === 'IN' ? 'Stock In' : 'Stock Out'}
                          size="small"
                          sx={{
                            backgroundColor: movement.type === 'IN' ? '#4CAF50' : '#f44336',
                            color: 'white',
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                    </ListItem>
                    {index < recentMovements.length - 1 && <Divider />}
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
          <Inventory sx={{ mr: 1 }} />
          Stock Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Warning sx={{ mr: 1 }} />
          Low Stock Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <LocalShipping sx={{ mr: 1 }} />
          Movement Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Category sx={{ mr: 1 }} />
          Category Analysis
        </MenuItem>
      </Menu>
    </Box>
  )
}

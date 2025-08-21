import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Chip
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Inventory,
  Assessment,
  Settings,
  Notifications,
  AccountCircle,
  Logout,
  Business,
  MonetizationOn,
  ShoppingCart,
  TrendingUp,
  LocalShipping
} from '@mui/icons-material'

const drawerWidth = 280

interface DashboardLayoutProps {
  children: React.ReactNode
}

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', active: true },
  { text: 'CRM & Sales', icon: <Business />, path: '/crm', active: true },
  { text: 'Orders', icon: <ShoppingCart />, path: '/orders', active: true },
  { text: 'Inventory', icon: <Inventory />, path: '/inventory', active: true },
  { text: 'Keuangan', icon: <MonetizationOn />, path: '/finance', active: true },
  { text: 'Pembelian', icon: <LocalShipping />, path: '/procurement', active: true },
  { text: 'Karyawan', icon: <People />, path: '/hr', active: true },
  { text: 'Laporan', icon: <Assessment />, path: '/reports', active: true },
  { text: 'Analytics', icon: <TrendingUp />, path: '/analytics', active: true },
  { text: 'Pengaturan', icon: <Settings />, path: '/settings', active: true }
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: 'New Order Received',
      message: 'Order #TXN-003 from PT Teknologi Maju',
      time: '5 minutes ago',
      type: 'order',
      unread: true
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      message: 'Product "Laptop Dell" stock is running low',
      time: '1 hour ago',
      type: 'inventory',
      unread: true
    },
    {
      id: 3,
      title: 'Payment Received',
      message: 'Payment of Rp 2,500,000 received',
      time: '2 hours ago',
      type: 'payment',
      unread: false
    },
    {
      id: 4,
      title: 'New Employee Added',
      message: 'Welcome Ahmad Rizki to the team',
      time: '1 day ago',
      type: 'hr',
      unread: false
    }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    handleProfileMenuClose()
  }

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget)
  }

  const handleNotificationClose = () => {
    setNotificationAnchor(null)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return '🛒'
      case 'inventory': return '📦'
      case 'payment': return '💰'
      case 'hr': return '👥'
      default: return '🔔'
    }
  }

  const drawer = (
    <Box>
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          🏢 ERP Platform
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Admin Dashboard
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => item.active ? navigate(item.path) : null}
              disabled={!item.active}
              sx={{
                borderRadius: 2,
                opacity: item.active ? 1 : 0.5,
                cursor: item.active ? 'pointer' : 'not-allowed',
                '&:hover': item.active ? {
                  backgroundColor: 'rgba(220, 20, 60, 0.1)',
                  '& .MuiListItemIcon-root': {
                    color: '#DC143C'
                  },
                  '& .MuiListItemText-primary': {
                    color: '#DC143C',
                    fontWeight: 'medium'
                  }
                } : {},
                ...(location.pathname === item.path && item.active && {
                  backgroundColor: 'rgba(220, 20, 60, 0.15)',
                  borderLeft: '4px solid #DC143C',
                  '& .MuiListItemIcon-root': {
                    color: '#DC143C'
                  },
                  '& .MuiListItemText-primary': {
                    color: '#DC143C',
                    fontWeight: 'bold'
                  }
                })
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem'
                }}
              />
              {!item.active && (
                <Chip
                  label="Soon"
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    height: 20,
                    backgroundColor: '#f0f0f0',
                    color: '#666'
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2, my: 2 }} />

      {/* User Info */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(220, 20, 60, 0.05)',
            border: '1px solid rgba(220, 20, 60, 0.1)'
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
              mr: 2
            }}
          >
            A
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              Admin User
            </Typography>
            <Chip
              label="Super Admin"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                backgroundColor: '#DC143C',
                color: 'white'
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: '#333',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#1A1A1A' }}>
            Dashboard Overview
          </Typography>

          {/* Notifications */}
          <IconButton
            color="inherit"
            sx={{ mr: 1 }}
            onClick={handleNotificationClick}
          >
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 350,
            maxHeight: 400,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have {unreadCount} unread notifications
          </Typography>
        </Box>

        {notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={handleNotificationClose}
            sx={{
              borderLeft: notification.unread ? '4px solid #DC143C' : '4px solid transparent',
              backgroundColor: notification.unread ? 'rgba(220, 20, 60, 0.02)' : 'transparent',
              '&:hover': {
                backgroundColor: notification.unread ? 'rgba(220, 20, 60, 0.08)' : 'rgba(0,0,0,0.04)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
              <Box sx={{ mr: 2, fontSize: '1.5rem' }}>
                {getNotificationIcon(notification.type)}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {notification.title}
                  </Typography>
                  {notification.unread && (
                    <Chip
                      size="small"
                      label="New"
                      sx={{
                        backgroundColor: '#DC143C',
                        color: 'white',
                        height: 20,
                        fontSize: '0.7rem'
                      }}
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}

        <Divider />
        <MenuItem onClick={handleNotificationClose} sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" sx={{ color: '#DC143C', fontWeight: 'medium' }}>
            View All Notifications
          </Typography>
        </MenuItem>
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: '#f5f5f5',
          minHeight: '100vh'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

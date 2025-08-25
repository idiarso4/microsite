import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { usePermissions } from '../../hooks/usePermissions'

import SessionInfo from '../auth/SessionInfo'
import NotificationCenter from '../common/NotificationCenter'
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
  LocalShipping,
  AdminPanelSettings,
  Security,
  History,
  Api,
  ContactPhone,
  ShowChart,
  RequestQuote,
  Receipt,
  LocalOffer,
  Assignment,
  Warehouse,
  SwapHoriz,
  QrCodeScanner,
  Engineering,
  Schedule,
  VerifiedUser,
  Handyman,
  AccessTime,
  BeachAccess,
  Payment,
  AccountBalance,
  TaxiAlert,
  BarChart,
  Build,
  Help,
  SupportAgent,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material'

const drawerWidth = 280

interface DashboardLayoutProps {
  children: React.ReactNode
}

const menuCategories = [
  {
    title: 'Dashboard',
    items: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', active: true },
    ]
  },
  {
    title: 'Administrasi',
    items: [
      { text: 'Pengguna & Role', icon: <AdminPanelSettings />, path: '/admin/users', active: true },
      { text: 'Hak Akses', icon: <Security />, path: '/admin/roles', active: true },
      { text: 'Audit Log', icon: <History />, path: '/admin/audit', active: true },
      { text: 'Pengaturan Sistem', icon: <Settings />, path: '/admin/settings', active: true },
      { text: 'Integrasi & API', icon: <Api />, path: '/admin/integrations', active: true },
    ]
  },
  {
    title: 'CRM & Sales',
    items: [
      { text: 'Leads', icon: <ContactPhone />, path: '/crm/leads', active: true, highlight: true },
      { text: 'Kontak & Perusahaan', icon: <Business />, path: '/crm/contacts', active: true, highlight: true },
      { text: 'Sales Pipeline', icon: <ShowChart />, path: '/crm/pipeline', active: true },
      { text: 'Penawaran', icon: <RequestQuote />, path: '/sales/quotes', active: true },
      { text: 'Sales Order', icon: <Receipt />, path: '/sales/orders', active: true },
      { text: 'Delivery Order', icon: <LocalShipping />, path: '/sales/deliveries', active: true },
      { text: 'Invoice Penjualan', icon: <Payment />, path: '/sales/invoices', active: true },
      { text: 'Retur Penjualan', icon: <Assignment />, path: '/sales/returns', active: true },
      { text: 'Harga & Promo', icon: <LocalOffer />, path: '/sales/pricing', active: true },
    ]
  },
  {
    title: 'e-Procurement',
    items: [
      { text: 'Permintaan Pembelian', icon: <Assignment />, path: '/procurement/requests', active: true, highlight: true },
      { text: 'RFQ/Tender', icon: <RequestQuote />, path: '/procurement/rfq', active: true },
      { text: 'Purchase Order', icon: <ShoppingCart />, path: '/procurement/po', active: true },
      { text: 'Penerimaan Barang', icon: <Warehouse />, path: '/procurement/gr', active: true },
      { text: 'Invoice Pembelian', icon: <Receipt />, path: '/procurement/invoices', active: true },
      { text: 'Retur Pembelian', icon: <Assignment />, path: '/procurement/returns', active: true },
      { text: 'Vendor Management', icon: <Business />, path: '/procurement/vendors', active: true },
    ]
  },
  {
    title: 'Manajemen Inventaris',
    items: [
      { text: 'Master Item', icon: <Inventory />, path: '/inventory/items', active: true, highlight: true },
      { text: 'Kartu Stok & Mutasi', icon: <Assessment />, path: '/inventory/ledger', active: true },
      { text: 'Stock Management', icon: <QrCodeScanner />, path: '/inventory/stock', active: true },
      { text: 'Transfer & Adjustment', icon: <SwapHoriz />, path: '/inventory/movements', active: true },
      { text: 'Stock Opname', icon: <Assignment />, path: '/inventory/opname', active: true },
      { text: 'Gudang', icon: <Warehouse />, path: '/inventory/warehouses', active: true },
    ]
  },
  {
    title: 'Trading & Distribution',
    items: [
      { text: 'Orders', icon: <ShoppingCart />, path: '/fulfillment/orders', active: true },
      { text: 'Pengiriman', icon: <LocalShipping />, path: '/fulfillment/shipments', active: true },
      { text: 'Rute & Scheduling', icon: <Schedule />, path: '/fulfillment/routes', active: false },
    ]
  },
  {
    title: 'Manufaktur',
    items: [
      { text: 'Bill of Materials', icon: <Engineering />, path: '/mfg/bom', active: true },
      { text: 'Routing & Work Center', icon: <Build />, path: '/mfg/routing', active: true },
      { text: 'MPS/MRP', icon: <Schedule />, path: '/mfg/planning', active: true },
      { text: 'Manufacturing Order', icon: <Assignment />, path: '/mfg/orders', active: true },
      { text: 'Issue/Receive Material', icon: <SwapHoriz />, path: '/mfg/materials', active: true },
      { text: 'Quality Control', icon: <VerifiedUser />, path: '/mfg/qc', active: true },
    ]
  },
  {
    title: 'Aset & Maintenance',
    items: [
      { text: 'Aset Tetap', icon: <AccountBalance />, path: '/fa/assets', active: true },
      { text: 'Jadwal Depresiasi', icon: <Schedule />, path: '/fa/schedule', active: true },
      { text: 'Maintenance', icon: <Handyman />, path: '/maint/workorders', active: true },
    ]
  },
  {
    title: 'SDM & Payroll',
    items: [
      { text: 'Data Karyawan', icon: <People />, path: '/hr/employees', active: true, highlight: true },
      { text: 'Absensi & Shift', icon: <AccessTime />, path: '/hr/attendance', active: true },
      { text: 'Cuti & Izin', icon: <BeachAccess />, path: '/hr/leave', active: true },
      { text: 'Payroll', icon: <MonetizationOn />, path: '/hr/payroll', active: true },
      { text: 'Rekrutmen', icon: <People />, path: '/hr/recruitment', active: false },
      { text: 'Kinerja/OKR', icon: <Assessment />, path: '/hr/performance', active: false },
    ]
  },
  {
    title: 'Keuangan & Akuntansi',
    items: [
      { text: 'Kas & Bank', icon: <AccountBalance />, path: '/fin/cashbank', active: true, highlight: true },
      { text: 'Piutang (AR)', icon: <TrendingUp />, path: '/fin/ar', active: true },
      { text: 'Hutang (AP)', icon: <TrendingUp />, path: '/fin/ap', active: true },
      { text: 'Jurnal Umum', icon: <Assessment />, path: '/fin/gl', active: true },
      { text: 'Periode & Closing', icon: <Schedule />, path: '/fin/periods', active: true },
      { text: 'Pajak', icon: <TaxiAlert />, path: '/fin/tax', active: true },
      { text: 'Laporan Keuangan', icon: <BarChart />, path: '/fin/reports', active: true },
    ]
  },
  {
    title: 'BI & Laporan',
    items: [
      { text: 'Report Builder', icon: <Build />, path: '/bi/builder', active: true },
      { text: 'Dashboard KPI', icon: <Dashboard />, path: '/bi/dashboards', active: true },
      { text: 'Ekspor & Data Hub', icon: <Assessment />, path: '/bi/export', active: true },
    ]
  },
  {
    title: 'Bantuan & Dokumen',
    items: [
      { text: 'SOP & Knowledge Base', icon: <Help />, path: '/help/kb', active: true },
      { text: 'Tiket/Helpdesk', icon: <SupportAgent />, path: '/help/tickets', active: false },
    ]
  }
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()
  const { getAccessibleModules, canAccessModule } = usePermissions()



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
      <Box sx={{ px: 1, py: 1 }}>
        {menuCategories.map((category) => (
          <Box key={category.title} sx={{ mb: 2 }}>
            {/* Category Title */}
            <Typography
              variant="caption"
              sx={{
                px: 2,
                py: 1,
                color: 'text.secondary',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {category.title}
            </Typography>

            {/* Category Items */}
            <List sx={{ py: 0 }}>
              {category.items.map((item) => (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => item.active ? navigate(item.path) : null}
                    disabled={!item.active}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      opacity: item.active ? 1 : 0.5,
                      cursor: item.active ? 'pointer' : 'not-allowed',
                      backgroundColor: item.highlight ? 'rgba(255, 152, 0, 0.1)' : 'transparent',
                      border: item.highlight ? '1px solid rgba(255, 152, 0, 0.3)' : 'none',
                      '&:hover': item.active ? {
                        backgroundColor: item.highlight ? 'rgba(255, 152, 0, 0.2)' : 'rgba(220, 20, 60, 0.1)',
                        '& .MuiListItemIcon-root': {
                          color: item.highlight ? '#FF9800' : '#DC143C'
                        },
                        '& .MuiListItemText-primary': {
                          color: item.highlight ? '#FF9800' : '#DC143C',
                          fontWeight: 'medium'
                        }
                      } : {},
                      ...(location.pathname === item.path && item.active && {
                        backgroundColor: item.highlight ? 'rgba(255, 152, 0, 0.2)' : 'rgba(220, 20, 60, 0.15)',
                        borderLeft: `4px solid ${item.highlight ? '#FF9800' : '#DC143C'}`,
                        '& .MuiListItemIcon-root': {
                          color: item.highlight ? '#FF9800' : '#DC143C'
                        },
                        '& .MuiListItemText-primary': {
                          color: item.highlight ? '#FF9800' : '#DC143C',
                          fontWeight: 'bold'
                        }
                      })
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: location.pathname === item.path ? 'bold' : 'medium'
                      }}
                    />
                    {!item.active && (
                      <Chip
                        label="Soon"
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          height: 18,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          color: 'text.secondary'
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>

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
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {user?.name || 'User'}
            </Typography>
            <Chip
              label={user?.role || 'User'}
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

        {/* Session Info */}
        <Box sx={{ mt: 2 }}>
          <SessionInfo compact={true} showActions={false} />
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
          <NotificationCenter />

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

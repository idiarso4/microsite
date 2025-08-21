import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Rating,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
  Tabs,
  Badge,
  Menu,
  MenuItem,
  ListItemButton,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material'
import {
  AccountBalance,
  Inventory,
  People,
  ShoppingCart,
  Assessment,
  Build,
  LocalShipping,
  Business,
  Analytics,
  CloudUpload,
  Hub,
  Support,
  CheckCircle,
  Star,
  Phone,
  Email,
  WhatsApp,
  Download,
  Menu as MenuIcon,
  ExpandMore,
  PlayArrow,
  Security,
  Speed,
  TrendingUp,
  Group,
  Language,
  Schedule,
  ArrowForward,
  Close
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface Solution {
  id: string
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  color: string
  features: string[]
  benefits: string[]
  category: string
  demoPath: string
  landingPath: string
  price: string
  popular?: boolean
}

export default function HashMicroStyleLanding() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [contactDialog, setContactDialog] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Navigation menu data
  const navigationMenus = {
    'Produk': {
      'Solutions for all': [
        { name: 'ERP', path: '/dashboard', description: 'Enterprise Resource Planning', icon: '🏢' },
        { name: 'Accounting', path: '/accounting', description: 'Sistem akuntansi terintegrasi', icon: '📊' },
        { name: 'Asset', path: '/solutions/asset', description: 'Manajemen aset perusahaan', icon: '📋' },
        { name: 'e-Invoicing', path: '/solutions/e-invoicing', description: 'Faktur elektronik otomatis', icon: '📄' },
        { name: 'Contract', path: '/solutions/contract', description: 'Manajemen kontrak digital', icon: '📝' }
      ],
      'Sales Solutions': [
        { name: 'CRM-Leads', path: '/crm', description: 'Manajemen prospek pelanggan', icon: '🎯' },
        { name: 'CRM-Sales', path: '/crm', description: 'Sistem penjualan terintegrasi', icon: '💼' },
        { name: 'POS-General', path: '/solutions/pos-general', description: 'Point of Sale umum', icon: '🛒' },
        { name: 'POS-Retail', path: '/solutions/pos-retail', description: 'Point of Sale retail', icon: '🏪' },
        { name: 'Marketing Automation', path: '/solutions/marketing', description: 'Otomasi pemasaran digital', icon: '📢' }
      ],
      'Supply Chain Solutions': [
        { name: 'Inventory', path: '/inventory', description: 'Manajemen inventori real-time', icon: '📦' },
        { name: 'Procurement', path: '/procurement', description: 'Sistem pengadaan barang', icon: '🛍️' },
        { name: 'Supply Chain', path: '/solutions/supply-chain', description: 'Rantai pasok terintegrasi', icon: '🔗' },
        { name: 'Barcode', path: '/solutions/barcode', description: 'Sistem barcode otomatis', icon: '📱' },
        { name: 'Warehouse', path: '/solutions/warehouse', description: 'Manajemen gudang pintar', icon: '🏭' },
        { name: 'Repair', path: '/solutions/repair', description: 'Sistem perbaikan & maintenance', icon: '🔧' },
        { name: 'Survey', path: '/solutions/survey', description: 'Survei & feedback pelanggan', icon: '📋' }
      ],
      'Service Solutions': [
        { name: 'Jasa Profesional', path: '/solutions/professional', description: 'Manajemen jasa profesional', icon: '👔' },
        { name: 'Booking/Reservation', path: '/solutions/booking', description: 'Sistem reservasi online', icon: '📅' },
        { name: 'Help Desk & Ticketing', path: '/solutions/helpdesk', description: 'Layanan bantuan pelanggan', icon: '🎫' },
        { name: 'Visitor', path: '/solutions/visitor', description: 'Manajemen pengunjung', icon: '👥' },
        { name: 'Certification', path: '/solutions/certification', description: 'Sistem sertifikasi digital', icon: '🏆' },
        { name: 'Berbasis Proyek', path: '/solutions/project', description: 'Manajemen proyek terintegrasi', icon: '📊' },
        { name: 'Event', path: '/solutions/event', description: 'Manajemen acara & event', icon: '🎉' }
      ],
      'Industrial Sectors': [
        { name: 'Fleet', path: '/solutions/fleet', description: 'Manajemen armada kendaraan', icon: '🚛' },
        { name: 'Konstruksi', path: '/solutions/construction', description: 'Industri konstruksi & bangunan', icon: '🏗️' },
        { name: 'Manufaktur', path: '/manufacturing', description: 'Industri manufaktur & produksi', icon: '🏭' },
        { name: 'Engineering', path: '/solutions/engineering', description: 'Layanan engineering profesional', icon: '⚙️' },
        { name: 'IT Inventory', path: '/solutions/it-inventory', description: 'Inventori perangkat IT', icon: '💻' },
        { name: 'Pertambangan', path: '/solutions/mining', description: 'Industri pertambangan', icon: '⛏️' }
      ],
      'HR Solutions': [
        { name: 'HRM', path: '/hr', description: 'Human Resource Management', icon: '👥' },
        { name: 'Timesheet', path: '/solutions/timesheet', description: 'Pencatatan waktu kerja', icon: '⏰' },
        { name: 'Staff Competency', path: '/solutions/competency', description: 'Kompetensi & skill karyawan', icon: '📈' },
        { name: 'e-Learning', path: '/solutions/elearning', description: 'Platform pembelajaran online', icon: '🎓' }
      ],
      'F&B Solutions': [
        { name: 'Food & Beverage ERP', path: '/solutions/fnb-erp', description: 'ERP khusus makanan & minuman', icon: '🍽️' },
        { name: 'POS-Restaurant', path: '/solutions/pos-restaurant', description: 'Point of Sale restoran', icon: '🍴' },
        { name: 'Central Kitchen', path: '/solutions/central-kitchen', description: 'Manajemen dapur pusat', icon: '👨‍🍳' },
        { name: 'e-Menu', path: '/solutions/e-menu', description: 'Menu digital interaktif', icon: '📱' },
        { name: 'Kitchen Display', path: '/solutions/kitchen-display', description: 'Display dapur digital', icon: '📺' },
        { name: 'Catering', path: '/solutions/catering', description: 'Sistem manajemen katering', icon: '🍱' }
      ],
      'Other Solutions': [
        { name: 'Retail', path: '/solutions/retail', description: 'Solusi bisnis retail', icon: '🛍️' },
        { name: 'Trading', path: '/solutions/trading', description: 'Perdagangan & distribusi', icon: '📊' },
        { name: 'Pemerintahan', path: '/solutions/government', description: 'Solusi sektor pemerintahan', icon: '🏛️' },
        { name: 'Keuangan', path: '/solutions/finance', description: 'Sektor keuangan & perbankan', icon: '🏦' },
        { name: 'Perhotelan', path: '/solutions/hospitality', description: 'Industri perhotelan', icon: '🏨' },
        { name: 'Pendidikan', path: '/solutions/education', description: 'Sektor pendidikan', icon: '🎓' },
        { name: 'Properti/Real Estate', path: '/solutions/real-estate', description: 'Industri properti', icon: '🏠' },
        { name: 'Rental', path: '/solutions/rental', description: 'Bisnis penyewaan', icon: '🚗' },
        { name: 'Facility', path: '/solutions/facility', description: 'Manajemen fasilitas', icon: '🏢' },
        { name: 'Document', path: '/solutions/document', description: 'Manajemen dokumen digital', icon: '📄' }
      ]
    },
    'Solusi': [
      { name: 'Untuk UKM', path: '/solutions/ukm', description: 'Solusi khusus usaha kecil menengah' },
      { name: 'Untuk Enterprise', path: '/solutions/enterprise', description: 'Solusi perusahaan besar' },
      { name: 'Untuk Retail', path: '/solutions/retail', description: 'Solusi bisnis retail' },
      { name: 'Untuk Manufaktur', path: '/solutions/manufacturing', description: 'Solusi industri manufaktur' }
    ],
    'Industri': [
      { name: 'Retail & E-commerce', path: '/industry/retail', description: 'Solusi untuk bisnis retail' },
      { name: 'Manufaktur', path: '/industry/manufacturing', description: 'Solusi industri manufaktur' },
      { name: 'Distribusi', path: '/industry/distribution', description: 'Solusi distribusi & logistik' },
      { name: 'Jasa & Konsultan', path: '/industry/services', description: 'Solusi perusahaan jasa' }
    ],
    'Harga': [
      { name: 'Paket Basic', path: '/pricing/basic', description: 'Untuk usaha kecil' },
      { name: 'Paket Professional', path: '/pricing/professional', description: 'Untuk usaha menengah' },
      { name: 'Paket Enterprise', path: '/pricing/enterprise', description: 'Untuk perusahaan besar' },
      { name: 'Custom Quote', path: '/pricing/custom', description: 'Penawaran khusus' }
    ]
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, menuName: string) => {
    setAnchorEl(event.currentTarget)
    setOpenMenu(menuName)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setOpenMenu(null)
  }

  const solutions: Solution[] = [
    {
      id: 'accounting',
      title: 'Accounting & Finance',
      subtitle: 'Sistem Akuntansi Terintegrasi',
      description: 'Kelola keuangan perusahaan dengan sistem akuntansi yang komprehensif dan terintegrasi',
      icon: <AccountBalance />,
      color: '#4CAF50',
      features: ['General Ledger', 'Accounts Payable/Receivable', 'Financial Reports', 'Tax Management'],
      benefits: ['Otomasi pembukuan', 'Laporan real-time', 'Compliance pajak', 'Cash flow monitoring'],
      category: 'Finance',
      demoPath: '/accounting/demo',
      landingPath: '/accounting',
      price: 'Mulai dari Rp 500.000/bulan'
    },
    {
      id: 'inventory',
      title: 'Inventory Management',
      subtitle: 'Manajemen Stok Cerdas',
      description: 'Kelola inventory dengan sistem tracking real-time dan automated reordering',
      icon: <Inventory />,
      color: '#FF9800',
      features: ['Multi-warehouse', 'Stock Alerts', 'Barcode Scanning', 'Inventory Reports'],
      benefits: ['Reduce stockout', 'Optimize inventory', 'Real-time tracking', 'Cost reduction'],
      category: 'Inventory',
      demoPath: '/inventory/demo',
      landingPath: '/inventory',
      price: 'Mulai dari Rp 400.000/bulan',
      popular: true
    },
    {
      id: 'crm',
      title: 'Sales & CRM',
      subtitle: 'Customer Relationship Management',
      description: 'Tingkatkan penjualan dengan sistem CRM yang powerful dan user-friendly',
      icon: <Business />,
      color: '#2196F3',
      features: ['Lead Management', 'Sales Pipeline', 'Customer Database', 'Sales Reports'],
      benefits: ['Increase sales', 'Better customer service', 'Sales automation', 'Performance tracking'],
      category: 'CRM',
      demoPath: '/crm/demo',
      landingPath: '/crm',
      price: 'Mulai dari Rp 350.000/bulan'
    },
    {
      id: 'procurement',
      title: 'Procurement',
      subtitle: 'e-Procurement System',
      description: 'Streamline proses pengadaan dengan sistem procurement yang terintegrasi',
      icon: <LocalShipping />,
      color: '#9C27B0',
      features: ['Purchase Orders', 'Vendor Management', 'Approval Workflow', 'Cost Analysis'],
      benefits: ['Cost savings', 'Process efficiency', 'Vendor performance', 'Compliance tracking'],
      category: 'Procurement',
      demoPath: '/procurement/demo',
      landingPath: '/procurement',
      price: 'Mulai dari Rp 450.000/bulan'
    },
    {
      id: 'hr',
      title: 'Human Resources',
      subtitle: 'HR Management System',
      description: 'Kelola SDM dengan sistem HR yang komprehensif dan mudah digunakan',
      icon: <People />,
      color: '#E91E63',
      features: ['Employee Database', 'Payroll Management', 'Leave Management', 'Performance Reviews'],
      benefits: ['HR automation', 'Employee satisfaction', 'Compliance management', 'Data insights'],
      category: 'HR',
      demoPath: '/hr/demo',
      landingPath: '/hr',
      price: 'Mulai dari Rp 300.000/bulan'
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing',
      subtitle: 'Production Management',
      description: 'Optimize proses produksi dengan sistem manufacturing yang terintegrasi',
      icon: <Build />,
      color: '#607D8B',
      features: ['Production Planning', 'Work Orders', 'Quality Control', 'Resource Planning'],
      benefits: ['Production efficiency', 'Quality improvement', 'Cost optimization', 'Real-time monitoring'],
      category: 'Manufacturing',
      demoPath: '/manufacturing/demo',
      landingPath: '/manufacturing',
      price: 'Mulai dari Rp 600.000/bulan'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Perusahaan Terpercaya' },
    { number: '50+', label: 'Negara' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ]

  const testimonials = [
    {
      name: 'Budi Santoso',
      company: 'PT Maju Bersama',
      role: 'CEO',
      rating: 5,
      comment: 'MicroSite ERP membantu kami mengoptimalkan operasional bisnis dengan sangat efektif.',
      initial: 'BS'
    },
    {
      name: 'Sari Dewi',
      company: 'CV Sukses Mandiri',
      role: 'Finance Manager',
      rating: 5,
      comment: 'Sistem akuntansi yang sangat mudah digunakan dan laporan yang akurat.',
      initial: 'SD'
    },
    {
      name: 'Ahmad Rahman',
      company: 'PT Teknologi Nusantara',
      role: 'Operations Director',
      rating: 5,
      comment: 'Inventory management yang real-time sangat membantu efisiensi warehouse kami.',
      initial: 'AR'
    }
  ]

  const handleGetStarted = (solution: Solution) => {
    const moduleLoginRoutes = {
      'Finance': '/accounting/login',
      'Inventory': '/inventory/login',
      'HR': '/hr/login',
      'CRM': '/crm/login',
      'Manufacturing': '/manufacturing/login',
      'Procurement': '/procurement/login'
    }
    const loginRoute = moduleLoginRoutes[solution.category as keyof typeof moduleLoginRoutes]
    navigate(loginRoute || '/login')
  }

  const handleLearnMore = (solution: Solution) => {
    navigate(solution.landingPath)
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: '#1e293b',
                mr: 4,
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              HashMicro
            </Typography>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {Object.keys(navigationMenus).map((menuName) => (
                  <Button
                    key={menuName}
                    color="inherit"
                    sx={{
                      color: '#64748b',
                      textTransform: 'none',
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: '#f1f5f9'
                      }
                    }}
                    onClick={(e) => handleMenuOpen(e, menuName)}
                    endIcon={<ExpandMore />}
                  >
                    {menuName}
                  </Button>
                ))}
                <Button
                  color="inherit"
                  sx={{
                    color: '#64748b',
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    '&:hover': {
                      backgroundColor: '#f1f5f9'
                    }
                  }}
                >
                  Tentang
                </Button>
                <Button
                  color="inherit"
                  sx={{
                    color: '#64748b',
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    '&:hover': {
                      backgroundColor: '#f1f5f9'
                    }
                  }}
                >
                  Blog
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isMobile && (
              <>
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    borderColor: '#e2e8f0',
                    color: '#64748b',
                    px: 3,
                    py: 1
                  }}
                >
                  Masuk
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#f97316',
                    color: 'white',
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#ea580c'
                    }
                  }}
                  onClick={() => setContactDialog(true)}
                >
                  Demo Gratis
                </Button>
              </>
            )}

            {isMobile && (
              <IconButton onClick={() => setMobileMenuOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Dropdown Menus */}
        {Object.entries(navigationMenus).map(([menuName, menuData]) => (
          <Menu
            key={menuName}
            anchorEl={anchorEl}
            open={openMenu === menuName}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: menuName === 'Produk' ? 1200 : 400,
                maxWidth: menuName === 'Produk' ? 1400 : 500,
                maxHeight: 700,
                overflow: 'auto',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
              }
            }}
          >
            {menuName === 'Produk' ? (
              // Special layout for Produk menu with categories
              <Box sx={{ p: 2 }}>
                {Object.entries(menuData as Record<string, any[]>).map(([categoryName, items]) => (
                  <Box key={categoryName} sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        mb: 2,
                        fontSize: '1rem',
                        borderBottom: '2px solid #f97316',
                        pb: 1
                      }}
                    >
                      {categoryName}
                    </Typography>
                    <Grid container spacing={1}>
                      {items.map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} lg={2.4} key={index}>
                          <MenuItem
                            onClick={() => {
                              navigate(item.path)
                              handleMenuClose()
                            }}
                            sx={{
                              p: 2,
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              borderRadius: 2,
                              border: '1px solid transparent',
                              '&:hover': {
                                backgroundColor: '#f8fafc',
                                border: '1px solid #f97316'
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography sx={{ fontSize: '1.2rem', mr: 1 }}>
                                {item.icon}
                              </Typography>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 600,
                                  color: '#1e293b',
                                  fontSize: '0.875rem'
                                }}
                              >
                                {item.name}
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#64748b',
                                fontSize: '0.75rem',
                                lineHeight: 1.3
                              }}
                            >
                              {item.description}
                            </Typography>
                          </MenuItem>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Box>
            ) : (
              // Regular layout for other menus
              (menuData as any[]).map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    navigate(item.path)
                    handleMenuClose()
                  }}
                  sx={{
                    py: 2,
                    px: 3,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    '&:hover': {
                      backgroundColor: '#f8fafc'
                    }
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5 }}>
                    {item.description}
                  </Typography>
                </MenuItem>
              ))
            )}
          </Menu>
        ))}

        {/* Mobile Menu Drawer */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          PaperProps={{
            sx: { width: 300 }
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Menu
              </Typography>
              <IconButton onClick={() => setMobileMenuOpen(false)}>
                <Close />
              </IconButton>
            </Box>

            {Object.entries(navigationMenus).map(([menuName, menuData]) => (
              <Accordion key={menuName} sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {menuName}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  {menuName === 'Produk' ? (
                    // Special layout for Produk menu with categories
                    Object.entries(menuData as Record<string, any[]>).map(([categoryName, items]) => (
                      <Box key={categoryName} sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: '#f97316',
                            mb: 1,
                            fontSize: '0.875rem'
                          }}
                        >
                          {categoryName}
                        </Typography>
                        {items.map((item, index) => (
                          <ListItemButton
                            key={index}
                            onClick={() => {
                              navigate(item.path)
                              setMobileMenuOpen(false)
                            }}
                            sx={{ pl: 2, py: 0.5 }}
                          >
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography sx={{ fontSize: '1rem', mr: 1 }}>
                                    {item.icon}
                                  </Typography>
                                  <Typography variant="body2">
                                    {item.name}
                                  </Typography>
                                </Box>
                              }
                              secondary={item.description}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItemButton>
                        ))}
                      </Box>
                    ))
                  ) : (
                    // Regular layout for other menus
                    (menuData as any[]).map((item, index) => (
                      <ListItemButton
                        key={index}
                        onClick={() => {
                          navigate(item.path)
                          setMobileMenuOpen(false)
                        }}
                        sx={{ pl: 0, py: 1 }}
                      >
                        <ListItemText
                          primary={item.name}
                          secondary={item.description}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItemButton>
                    ))
                  )}
                </AccordionDetails>
              </Accordion>
            ))}

            <Divider sx={{ my: 2 }} />

            <Stack spacing={2}>
              <Button variant="outlined" fullWidth sx={{ textTransform: 'none' }}>
                Masuk
              </Button>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#f97316',
                  '&:hover': { backgroundColor: '#ea580c' }
                }}
                onClick={() => {
                  setContactDialog(true)
                  setMobileMenuOpen(false)
                }}
              >
                Demo Gratis
              </Button>
            </Stack>
          </Box>
        </Drawer>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: { xs: 8, md: 12 }
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                ERP Solution untuk
                <Box component="span" sx={{ color: '#fbbf24', display: 'block' }}>
                  Bisnis Modern
                </Box>
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4,
                  opacity: 0.9,
                  lineHeight: 1.6
                }}
              >
                Tingkatkan efisiensi operasional bisnis Anda dengan sistem ERP terintegrasi yang mudah digunakan dan powerful.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained"
                  size="large"
                  sx={{ 
                    backgroundColor: '#fbbf24',
                    color: '#1f2937',
                    fontWeight: 'bold',
                    px: 4,
                    py: 1.5,
                    '&:hover': { backgroundColor: '#f59e0b' }
                  }}
                  onClick={() => setContactDialog(true)}
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrow />}
                  sx={{ 
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Watch Demo
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                position: 'relative',
                textAlign: 'center'
              }}>
                <Box sx={{ 
                  width: '100%',
                  height: 400,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Typography variant="h4" sx={{ opacity: 0.7 }}>
                    Dashboard Preview
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#667eea',
                      mb: 1
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Solutions Section */}
      <Box sx={{ py: 8, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                color: '#1e293b'
              }}
            >
              Complete ERP Solutions
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Pilih modul yang sesuai dengan kebutuhan bisnis Anda atau gunakan semua dalam satu platform terintegrasi
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {solutions.map((solution) => (
              <Grid item xs={12} md={6} lg={4} key={solution.id}>
                <Card sx={{
                  height: '100%',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  },
                  border: solution.popular ? '2px solid #fbbf24' : '1px solid #e2e8f0'
                }}>
                  {solution.popular && (
                    <Chip
                      label="Most Popular"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: 20,
                        backgroundColor: '#fbbf24',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  )}

                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 3
                    }}>
                      <Avatar sx={{
                        backgroundColor: solution.color,
                        width: 56,
                        height: 56,
                        mr: 2
                      }}>
                        {solution.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {solution.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {solution.subtitle}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{ mb: 3, color: '#64748b', lineHeight: 1.6 }}
                    >
                      {solution.description}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Key Features:
                      </Typography>
                      <List dense>
                        {solution.features.slice(0, 3).map((feature, index) => (
                          <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <CheckCircle sx={{ fontSize: 16, color: solution.color }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={feature}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: solution.color,
                        mb: 3
                      }}
                    >
                      {solution.price}
                    </Typography>

                    <Stack spacing={2}>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          backgroundColor: solution.color,
                          '&:hover': {
                            backgroundColor: solution.color,
                            filter: 'brightness(0.9)'
                          }
                        }}
                        onClick={() => handleGetStarted(solution)}
                      >
                        Start Free Trial
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          borderColor: solution.color,
                          color: solution.color,
                          '&:hover': {
                            backgroundColor: solution.color,
                            color: 'white'
                          }
                        }}
                        onClick={() => handleLearnMore(solution)}
                      >
                        Learn More
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Box sx={{ py: 8, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  mb: 3,
                  color: '#1e293b'
                }}
              >
                Mengapa Memilih MicroSite ERP?
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.6 }}
              >
                Kami memahami tantangan bisnis modern dan menyediakan solusi ERP yang tepat untuk kebutuhan Anda.
              </Typography>

              <Grid container spacing={3}>
                {[
                  { icon: <Security />, title: 'Keamanan Terjamin', desc: 'Data terenkripsi dengan standar enterprise' },
                  { icon: <Speed />, title: 'Performa Tinggi', desc: 'Response time cepat dan uptime 99.9%' },
                  { icon: <Support />, title: 'Support 24/7', desc: 'Tim support siap membantu kapan saja' },
                  { icon: <Language />, title: 'Multi-bahasa', desc: 'Mendukung Bahasa Indonesia dan Inggris' }
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Avatar sx={{
                        backgroundColor: '#667eea',
                        width: 48,
                        height: 48,
                        mr: 2
                      }}>
                        {item.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{
                height: 400,
                backgroundColor: '#f1f5f9',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="h5" color="text.secondary">
                  Feature Showcase
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                color: '#1e293b'
              }}
            >
              Dipercaya oleh 10,000+ Perusahaan
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
            >
              Lihat apa kata klien kami tentang MicroSite ERP
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{
                  height: '100%',
                  p: 3,
                  textAlign: 'center',
                  border: '1px solid #e2e8f0'
                }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      backgroundColor: '#667eea',
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {testimonial.initial}
                  </Avatar>
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      fontStyle: 'italic',
                      color: '#64748b'
                    }}
                  >
                    "{testimonial.comment}"
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {testimonial.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.role}, {testimonial.company}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{
        py: 8,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                mb: 3
              }}
            >
              Siap Mengoptimalkan Bisnis Anda?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9
              }}
            >
              Mulai free trial 30 hari dan rasakan perbedaannya
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#fbbf24',
                  color: '#1f2937',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  '&:hover': { backgroundColor: '#f59e0b' }
                }}
                onClick={() => setContactDialog(true)}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Phone />}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
                onClick={() => setContactDialog(true)}
              >
                Schedule Demo
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Contact Dialog */}
      <Dialog open={contactDialog} onClose={() => setContactDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Get Started with MicroSite ERP
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Isi form di bawah untuk memulai free trial atau konsultasi gratis
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nama Lengkap"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Email Perusahaan"
              type="email"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Nama Perusahaan"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Nomor Telepon"
              variant="outlined"
              required
            />
            <FormControl fullWidth variant="outlined" required>
              <InputLabel
                id="jumlah-karyawan-select-label"
                htmlFor="jumlah-karyawan-select"
              >
                Jumlah Karyawan
              </InputLabel>
              <Select
                labelId="jumlah-karyawan-select-label"
                id="jumlah-karyawan-select"
                label="Jumlah Karyawan"
                native
                defaultValue=""
                inputProps={{
                  name: 'jumlah-karyawan',
                  id: 'jumlah-karyawan-select',
                  'aria-label': 'Pilih jumlah karyawan perusahaan Anda',
                  'aria-labelledby': 'jumlah-karyawan-select-label',
                  'aria-describedby': 'jumlah-karyawan-select-helper',
                  title: 'Pilih jumlah karyawan perusahaan Anda',
                  'aria-required': 'true'
                }}
              >
                <option value="" disabled>Pilih jumlah karyawan</option>
                <option value="1-10">1-10 karyawan</option>
                <option value="11-50">11-50 karyawan</option>
                <option value="51-200">51-200 karyawan</option>
                <option value="200+">200+ karyawan</option>
              </Select>
              <FormHelperText id="jumlah-karyawan-select-helper">
                Pilih rentang jumlah karyawan di perusahaan Anda
              </FormHelperText>
            </FormControl>
            <TextField
              fullWidth
              label="Modul yang Diminati"
              multiline
              rows={3}
              variant="outlined"
              placeholder="Ceritakan kebutuhan ERP perusahaan Anda..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setContactDialog(false)}>
            Batal
          </Button>
          <Button
            variant="contained"
            onClick={() => setContactDialog(false)}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 4
            }}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

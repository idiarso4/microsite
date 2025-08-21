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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider
} from '@mui/material'
import {
  AccountBalance,
  Receipt,
  TrendingUp,
  CreditCard,
  Assessment,
  CheckCircle,
  Phone,
  Email,
  WhatsApp,
  Download,
  Menu as MenuIcon,
  Close,
  Calculate,
  PieChart,
  BarChart,
  Timeline
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export default function AccountingLandingPage() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [contactDialog, setContactDialog] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const accountingFeatures = [
    {
      icon: <AccountBalance sx={{ fontSize: 40, color: '#4CAF50' }} />,
      title: 'General Ledger',
      description: 'Complete chart of accounts dengan automated posting dan real-time balance updates.',
      features: ['Chart of Accounts', 'Journal Entries', 'Trial Balance', 'Account Reconciliation']
    },
    {
      icon: <Receipt sx={{ fontSize: 40, color: '#2196F3' }} />,
      title: 'Accounts Payable/Receivable',
      description: 'Kelola vendor dan customer accounts dengan automated aging reports.',
      features: ['Vendor Management', 'Customer Invoicing', 'Payment Tracking', 'Aging Reports']
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#FF9800' }} />,
      title: 'Financial Reports',
      description: 'Generate comprehensive financial statements dan custom reports.',
      features: ['P&L Statement', 'Balance Sheet', 'Cash Flow', 'Custom Reports']
    },
    {
      icon: <CreditCard sx={{ fontSize: 40, color: '#9C27B0' }} />,
      title: 'Tax Management',
      description: 'Automated tax calculations dan compliance reporting untuk semua jenis pajak.',
      features: ['VAT Calculation', 'Income Tax', 'Tax Reports', 'Compliance Tracking']
    },
    {
      icon: <Calculate sx={{ fontSize: 40, color: '#607D8B' }} />,
      title: 'Cost Accounting',
      description: 'Track dan analyze costs dengan detailed cost center reporting.',
      features: ['Cost Centers', 'Job Costing', 'Overhead Allocation', 'Variance Analysis']
    },
    {
      icon: <Assessment sx={{ fontSize: 40, color: '#795548' }} />,
      title: 'Budget & Forecasting',
      description: 'Create budgets dan financial forecasts dengan variance analysis.',
      features: ['Budget Planning', 'Forecasting', 'Variance Reports', 'KPI Tracking']
    }
  ]

  const pricingPlans = [
    {
      title: 'Accounting Starter',
      price: '$49',
      period: 'per month',
      description: 'Perfect for small businesses',
      features: [
        'Up to 10 users',
        'Basic accounting modules',
        'Standard reports',
        'Email support',
        'Cloud storage'
      ],
      popular: false
    },
    {
      title: 'Accounting Professional',
      price: '$99',
      period: 'per month',
      description: 'Complete accounting solution',
      features: [
        'Up to 50 users',
        'All accounting modules',
        'Advanced reports',
        'Priority support',
        'API access',
        'Custom integrations'
      ],
      popular: true
    },
    {
      title: 'Accounting Enterprise',
      price: 'Custom',
      period: 'contact sales',
      description: 'For large organizations',
      features: [
        'Unlimited users',
        'Custom modules',
        'Dedicated support',
        'On-premise option',
        'Advanced security',
        'Training included'
      ],
      popular: false
    }
  ]

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ backgroundColor: '#fff', color: '#333', boxShadow: 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#4CAF50' }}>
            💰 MicroSite Accounting & Finance
          </Typography>
          
          {!isMobile ? (
            <Stack direction="row" spacing={2}>
              <Button color="inherit" onClick={() => navigate('/')}>
                Back to Main
              </Button>
              <Button color="inherit" onClick={() => setContactDialog(true)}>
                Contact
              </Button>
              <Button 
                variant="contained" 
                sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } }}
                onClick={() => navigate('/accounting/login')}
              >
                Login to Accounting
              </Button>
            </Stack>
          ) : (
            <Button onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon />
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section - HashMicro Style */}
      <Box sx={{ backgroundColor: '#fff', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left Content */}
            <Grid item xs={12} md={6}>
              <Box sx={{ pr: { md: 4 } }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 'bold',
                    color: '#1a1a1a',
                    lineHeight: 1.2,
                    mb: 3
                  }}
                >
                  Software Akuntansi
                  <Box component="span" sx={{ color: '#4CAF50', display: 'block' }}>
                    Terlengkap di Indonesia
                  </Box>
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: '#666',
                    fontWeight: 400,
                    mb: 4,
                    lineHeight: 1.4
                  }}
                >
                  Kelola keuangan bisnis dengan sistem akuntansi terintegrasi.
                  Otomatisasi laporan keuangan, pajak, dan compliance dalam satu platform.
                </Typography>

                {/* Key Benefits */}
                <Box sx={{ mb: 4 }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ color: '#4CAF50', mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Otomatisasi Laporan Keuangan</strong> - P&L, Neraca, Arus Kas
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ color: '#4CAF50', mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Perhitungan Pajak Otomatis</strong> - PPh, PPN, dan e-Faktur
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ color: '#4CAF50', mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Multi-Currency & Multi-Company</strong> - Untuk bisnis global
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#388E3C' }
                    }}
                    onClick={() => navigate('/accounting/login')}
                  >
                    Coba Gratis Sekarang
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: '#4CAF50',
                      color: '#4CAF50',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': {
                        borderColor: '#388E3C',
                        backgroundColor: 'rgba(76, 175, 80, 0.04)'
                      }
                    }}
                    onClick={() => setContactDialog(true)}
                  >
                    Konsultasi Gratis
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {/* Right Content - Hero Image/Video */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  backgroundColor: '#f8f9fa',
                  borderRadius: 3,
                  p: 4,
                  textAlign: 'center',
                  border: '1px solid #e0e0e0'
                }}
              >
                <Typography variant="h4" sx={{ color: '#4CAF50', mb: 2, fontWeight: 'bold' }}>
                  💰 Dashboard Akuntansi
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Interface yang user-friendly dengan real-time financial insights
                </Typography>

                {/* Mock Dashboard Preview */}
                <Box
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    p: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <AccountBalance sx={{ color: '#4CAF50', fontSize: 30, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Rp 2.5M</Typography>
                        <Typography variant="caption">Total Revenue</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <Receipt sx={{ color: '#2196F3', fontSize: 30, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>156</Typography>
                        <Typography variant="caption">Invoices</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Info Bar */}
      <Box sx={{ backgroundColor: '#4CAF50', color: 'white', py: 1 }}>
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            justifyContent="space-between" 
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2">
              📧 Accounting Support: accounting@microsite.co.id
            </Typography>
            <Typography variant="body2">
              📞 Hubungi Tim Accounting: (021) 50996750 ext. 101
            </Typography>
            <Button
              variant="contained"
              size="small"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
              }}
              startIcon={<Download />}
            >
              Download Accounting Brochure
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Why Choose MicroSite - HashMicro Style */}
      <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' },
              color: '#1a1a1a'
            }}
          >
            Mengapa Pilih Software Akuntansi MicroSite?
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, fontWeight: 400 }}
          >
            Dipercaya oleh 10,000+ perusahaan di Indonesia untuk mengelola keuangan mereka
          </Typography>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <CheckCircle sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Compliance Terjamin
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sesuai dengan standar akuntansi Indonesia (SAK) dan peraturan perpajakan terbaru.
                  Otomatis update sesuai regulasi pemerintah.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: '#2196F3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <TrendingUp sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Efisiensi 10x Lebih Cepat
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Otomatisasi proses akuntansi mengurangi waktu pembuatan laporan dari hari menjadi menit.
                  Hemat waktu dan biaya operasional.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: '#FF9800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <Assessment sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Real-time Insights
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Dashboard analytics memberikan insight real-time tentang kondisi keuangan perusahaan.
                  Buat keputusan bisnis yang tepat.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Accounting Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' },
              color: '#1a1a1a'
            }}
          >
            Fitur Lengkap Software Akuntansi
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, fontWeight: 400 }}
          >
            Semua yang Anda butuhkan untuk mengelola keuangan perusahaan secara profesional
          </Typography>
          
          <Grid container spacing={4}>
            {accountingFeatures.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: 4 }
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {feature.description}
                    </Typography>
                    <List dense>
                      {feature.features.map((item, idx) => (
                        <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 24 }}>
                            <CheckCircle sx={{ fontSize: 16, color: '#4CAF50' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={item} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{ 
                          backgroundColor: '#4CAF50',
                          '&:hover': { backgroundColor: '#388E3C' }
                        }}
                        onClick={() => navigate('/accounting/login')}
                      >
                        Try {feature.title}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            Accounting Pricing Plans
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    position: 'relative',
                    border: plan.popular ? '2px solid #4CAF50' : '2px solid transparent',
                    transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                    '&:hover': {
                      border: '2px solid #4CAF50',
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  {plan.popular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        px: 3,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: 'bold'
                      }}
                    >
                      Most Popular
                    </Box>
                  )}
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {plan.title}
                    </Typography>
                    <Typography variant="h3" sx={{ color: '#4CAF50', fontWeight: 'bold', mb: 1 }}>
                      {plan.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {plan.period}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      {plan.description}
                    </Typography>

                    <List>
                      {plan.features.map((feature, idx) => (
                        <ListItem key={idx} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>

                    <Button
                      fullWidth
                      variant={plan.popular ? "contained" : "outlined"}
                      sx={{
                        mt: 3,
                        backgroundColor: plan.popular ? '#4CAF50' : 'transparent',
                        borderColor: '#4CAF50',
                        color: plan.popular ? 'white' : '#4CAF50',
                        '&:hover': {
                          backgroundColor: '#4CAF50',
                          color: 'white'
                        }
                      }}
                      onClick={() => navigate('/accounting/login')}
                    >
                      {plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Dialog */}
      <Dialog open={contactDialog} onClose={() => setContactDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Contact Accounting Team
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField fullWidth label="Company Name" variant="outlined" />
            <TextField fullWidth label="Your Name" variant="outlined" />
            <TextField fullWidth label="Email" type="email" variant="outlined" />
            <TextField fullWidth label="Phone" variant="outlined" />
            <TextField fullWidth label="Accounting Requirements" multiline rows={4} variant="outlined" />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Accounting Support
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 2, color: '#4CAF50' }} />
              <Typography>accounting@microsite.co.id</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ mr: 2, color: '#4CAF50' }} />
              <Typography>(021) 50996750 ext. 101</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WhatsApp sx={{ mr: 2, color: '#25D366' }} />
              <Typography>WhatsApp Accounting Support</Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } }}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#333', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                💰 MicroSite Accounting & Finance
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Complete accounting solution untuk bisnis modern.
                Kelola keuangan dengan sistem terintegrasi yang powerful dan user-friendly.
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Accounting Features
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">General Ledger</Typography>
                <Typography variant="body2">A/P & A/R</Typography>
                <Typography variant="body2">Financial Reports</Typography>
                <Typography variant="body2">Tax Management</Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Support
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">📧 accounting@microsite.co.id</Typography>
                <Typography variant="body2">📞 (021) 50996750 ext. 101</Typography>
                <Typography variant="body2">🏢 Jakarta, Indonesia</Typography>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: '#555' }} />

          <Typography variant="body2" textAlign="center" color="text.secondary">
            © 2024 MicroSite Accounting & Finance. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

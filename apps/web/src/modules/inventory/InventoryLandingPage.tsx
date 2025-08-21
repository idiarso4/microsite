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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider
} from '@mui/material'
import {
  Inventory,
  QrCode,
  TrendingUp,
  LocalShipping,
  Assessment,
  CheckCircle,
  Phone,
  Email,
  WhatsApp,
  Download,
  Menu as MenuIcon,
  Warehouse,
  Scanner,
  Analytics,
  ShoppingCart
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export default function InventoryLandingPage() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [contactDialog, setContactDialog] = useState(false)

  const inventoryFeatures = [
    {
      icon: <Inventory sx={{ fontSize: 40, color: '#FF9800' }} />,
      title: 'Stock Management',
      description: 'Real-time inventory tracking dengan automated reorder points dan stock alerts.',
      features: ['Real-time Stock Levels', 'Automated Reorder Points', 'Stock Alerts', 'Multi-location Support']
    },
    {
      icon: <QrCode sx={{ fontSize: 40, color: '#2196F3' }} />,
      title: 'Barcode & QR Code',
      description: 'Advanced barcode scanning dan QR code generation untuk efficient tracking.',
      features: ['Barcode Generation', 'QR Code Scanning', 'Mobile App Support', 'Batch Processing']
    },
    {
      icon: <Warehouse sx={{ fontSize: 40, color: '#4CAF50' }} />,
      title: 'Warehouse Management',
      description: 'Complete warehouse operations dengan bin locations dan pick/pack optimization.',
      features: ['Bin Location Management', 'Pick & Pack Optimization', 'Cycle Counting', 'Warehouse Layout']
    },
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: '#9C27B0' }} />,
      title: 'Supply Chain',
      description: 'End-to-end supply chain visibility dengan vendor management dan procurement.',
      features: ['Vendor Management', 'Purchase Orders', 'Receiving Management', 'Drop Shipping']
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: '#607D8B' }} />,
      title: 'Inventory Analytics',
      description: 'Advanced analytics untuk inventory optimization dan demand forecasting.',
      features: ['Demand Forecasting', 'ABC Analysis', 'Turnover Reports', 'Cost Analysis']
    },
    {
      icon: <Assessment sx={{ fontSize: 40, color: '#795548' }} />,
      title: 'Reporting & Compliance',
      description: 'Comprehensive reporting untuk compliance dan business intelligence.',
      features: ['Stock Valuation Reports', 'Movement History', 'Compliance Tracking', 'Custom Reports']
    }
  ]

  const pricingPlans = [
    {
      title: 'Inventory Starter',
      price: '$39',
      period: 'per month',
      description: 'Perfect for small warehouses',
      features: [
        'Up to 1,000 SKUs',
        'Basic inventory tracking',
        'Barcode scanning',
        'Email support',
        'Mobile app access'
      ],
      popular: false
    },
    {
      title: 'Inventory Professional',
      price: '$89',
      period: 'per month',
      description: 'Complete inventory solution',
      features: [
        'Up to 10,000 SKUs',
        'Advanced analytics',
        'Multi-location support',
        'Priority support',
        'API integrations',
        'Custom workflows'
      ],
      popular: true
    },
    {
      title: 'Inventory Enterprise',
      price: 'Custom',
      period: 'contact sales',
      description: 'For large operations',
      features: [
        'Unlimited SKUs',
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#FF9800' }}>
            📦 MicroSite Inventory Management
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
                sx={{ backgroundColor: '#FF9800', '&:hover': { backgroundColor: '#F57C00' } }}
                onClick={() => navigate('/inventory/login')}
              >
                Login to Inventory
              </Button>
            </Stack>
          ) : (
            <Button onClick={() => setContactDialog(true)}>
              <MenuIcon />
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant={isMobile ? "h3" : "h2"} 
            component="h1" 
            gutterBottom 
            sx={{ fontWeight: 'bold', mb: 3 }}
          >
            Smart Inventory Management System
          </Typography>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            sx={{ mb: 2, opacity: 0.9 }}
          >
            Kelola inventory dengan teknologi terdepan dan real-time tracking
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ mb: 4, opacity: 0.8 }}
          >
            Dari barcode scanning hingga demand forecasting dalam satu platform yang powerful
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              sx={{ 
                backgroundColor: 'white', 
                color: '#FF9800',
                '&:hover': { backgroundColor: '#f5f5f5' },
                px: 4,
                py: 1.5
              }}
              onClick={() => navigate('/inventory/login')}
            >
              Start Inventory System
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
                px: 4,
                py: 1.5
              }}
              onClick={() => setContactDialog(true)}
            >
              Request Demo
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Contact Info Bar */}
      <Box sx={{ backgroundColor: '#FF9800', color: 'white', py: 1 }}>
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            justifyContent="space-between" 
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2">
              📧 Inventory Support: inventory@microsite.co.id
            </Typography>
            <Typography variant="body2">
              📞 Hubungi Tim Inventory: (021) 50996750 ext. 102
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
              Download Inventory Brochure
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Inventory Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Comprehensive Inventory Features
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Everything you need for complete inventory management
          </Typography>
          
          <Grid container spacing={4}>
            {inventoryFeatures.map((feature, index) => (
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
                            <CheckCircle sx={{ fontSize: 16, color: '#FF9800' }} />
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
                          backgroundColor: '#FF9800',
                          '&:hover': { backgroundColor: '#F57C00' }
                        }}
                        onClick={() => navigate('/inventory/login')}
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

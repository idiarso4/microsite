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
  IconButton
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
  Close
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export default function ComprehensiveLandingPage() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [contactDialog, setContactDialog] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const businessSolutions = [
    {
      icon: <AccountBalance sx={{ fontSize: 40, color: '#DC143C' }} />,
      title: 'Accounting & Finance',
      description: 'Complete financial management with automated bookkeeping, invoicing, and reporting.',
      features: ['General Ledger', 'Accounts Payable/Receivable', 'Financial Reports', 'Tax Management']
    },
    {
      icon: <Inventory sx={{ fontSize: 40, color: '#4CAF50' }} />,
      title: 'Inventory Management',
      description: 'Real-time stock tracking, warehouse management, and automated reordering.',
      features: ['Multi-warehouse', 'Stock Alerts', 'Barcode Scanning', 'Inventory Reports']
    },
    {
      icon: <People sx={{ fontSize: 40, color: '#2196F3' }} />,
      title: 'Human Resources',
      description: 'Employee management, payroll processing, and performance tracking.',
      features: ['Employee Database', 'Payroll Management', 'Leave Management', 'Performance Reviews']
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 40, color: '#FF9800' }} />,
      title: 'Sales & CRM',
      description: 'Customer relationship management with sales pipeline and lead tracking.',
      features: ['Lead Management', 'Sales Pipeline', 'Customer Database', 'Sales Reports']
    },
    {
      icon: <Build sx={{ fontSize: 40, color: '#9C27B0' }} />,
      title: 'Manufacturing',
      description: 'Production planning, quality control, and manufacturing execution.',
      features: ['Production Planning', 'Quality Control', 'Bill of Materials', 'Work Orders']
    },
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: '#607D8B' }} />,
      title: 'Supply Chain',
      description: 'Procurement, vendor management, and supply chain optimization.',
      features: ['Vendor Management', 'Purchase Orders', 'Supply Planning', 'Logistics']
    },
    {
      icon: <Assessment sx={{ fontSize: 40, color: '#795548' }} />,
      title: 'Business Intelligence',
      description: 'Advanced analytics, reporting, and data visualization tools.',
      features: ['Custom Dashboards', 'Real-time Reports', 'Data Analytics', 'KPI Tracking']
    },
    {
      icon: <CloudUpload sx={{ fontSize: 40, color: '#3F51B5' }} />,
      title: 'Cloud Integration',
      description: 'Seamless cloud deployment with scalability and security.',
      features: ['Cloud Hosting', 'Data Backup', 'Scalability', 'Security']
    }
  ]

  const industries = [
    { name: 'Manufacturing', icon: '🏭', description: 'Production and quality control' },
    { name: 'Retail & E-commerce', icon: '🛒', description: 'Sales and inventory management' },
    { name: 'Construction', icon: '🏗️', description: 'Project and resource management' },
    { name: 'Healthcare', icon: '🏥', description: 'Patient and facility management' },
    { name: 'Education', icon: '🎓', description: 'Student and academic management' },
    { name: 'Hospitality', icon: '🏨', description: 'Guest and service management' },
    { name: 'Logistics', icon: '🚚', description: 'Transportation and delivery' },
    { name: 'Professional Services', icon: '💼', description: 'Client and project management' }
  ]

  const testimonials = [
    {
      name: 'PT Teknologi Maju',
      role: 'CEO',
      avatar: 'TM',
      rating: 5,
      comment: 'MicroSite ERP telah mengubah cara kami mengelola bisnis. Efisiensi meningkat 40% dalam 6 bulan.'
    },
    {
      name: 'CV Sukses Mandiri',
      role: 'Operations Manager',
      avatar: 'SM',
      rating: 5,
      comment: 'Sistem yang sangat user-friendly dan support team yang responsif. Highly recommended!'
    },
    {
      name: 'PT Digital Solutions',
      role: 'Finance Director',
      avatar: 'DS',
      rating: 5,
      comment: 'Reporting dan analytics yang powerful membantu kami membuat keputusan bisnis yang lebih baik.'
    }
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ backgroundColor: '#fff', color: '#333', boxShadow: 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#DC143C' }}>
            🏢 MicroSite Business Solutions
          </Typography>
          
          {!isMobile ? (
            <Stack direction="row" spacing={2}>
              <Button color="inherit" onClick={() => scrollToSection('solutions')}>
                Solutions
              </Button>
              <Button color="inherit" onClick={() => scrollToSection('industries')}>
                Industries
              </Button>
              <Button color="inherit" onClick={() => scrollToSection('testimonials')}>
                Testimonials
              </Button>
              <Button color="inherit" onClick={() => setContactDialog(true)}>
                Contact
              </Button>
              <Button 
                variant="contained" 
                sx={{ backgroundColor: '#DC143C', '&:hover': { backgroundColor: '#B91C3C' } }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </Stack>
          ) : (
            <IconButton onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            Complete Business Management Solutions
          </Typography>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{ mb: 4, opacity: 0.9 }}
          >
            Integrated ERP platform for modern businesses - from accounting to manufacturing
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              sx={{ 
                backgroundColor: '#DC143C', 
                '&:hover': { backgroundColor: '#B91C3C' },
                px: 4,
                py: 1.5
              }}
              onClick={() => navigate('/login')}
            >
              Start Free Trial
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
      <Box sx={{ backgroundColor: '#DC143C', color: 'white', py: 1 }}>
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            justifyContent="space-between" 
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2">
              📧 Email: hello@microsite.co.id
            </Typography>
            <Typography variant="body2">
              📞 Hubungi Kami: (021) 50996750
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
              Download Skema Harga
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Business Solutions Section */}
      <Box id="solutions" sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            Comprehensive Business Solutions
          </Typography>

          <Grid container spacing={4}>
            {businessSolutions.map((solution, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: 4 }
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {solution.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {solution.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {solution.description}
                    </Typography>
                    <List dense>
                      {solution.features.map((feature, idx) => (
                        <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 24 }}>
                            <CheckCircle sx={{ fontSize: 16, color: '#4CAF50' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Integrated System Visualization */}
      <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            Integrated Business Ecosystem
          </Typography>

          <Box sx={{ position: 'relative', textAlign: 'center', py: 4 }}>
            {/* Central Hub */}
            <Paper
              elevation={8}
              sx={{
                position: 'relative',
                display: 'inline-block',
                p: 4,
                borderRadius: '50%',
                backgroundColor: '#DC143C',
                color: 'white',
                zIndex: 2
              }}
            >
              <Hub sx={{ fontSize: 60 }} />
              <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                Integrated System
              </Typography>
            </Paper>

            {/* Surrounding Solutions */}
            <Grid container spacing={2} sx={{ mt: 4 }}>
              {businessSolutions.slice(0, 6).map((solution, index) => (
                <Grid item xs={6} md={2} key={index}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 4,
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    {solution.icon}
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium' }}>
                      {solution.title.split(' ')[0]}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Industries Section */}
      <Box id="industries" sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            Industries We Serve
          </Typography>

          <Grid container spacing={3}>
            {industries.map((industry, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
                  }}
                >
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {industry.icon}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {industry.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {industry.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Key Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            Why Choose MicroSite?
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: '#f8f9fa',
                    borderRadius: '50%',
                    width: 100,
                    height: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <CloudUpload sx={{ fontSize: 40, color: '#DC143C' }} />
                </Paper>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Cloud-Based
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Access your business data anywhere, anytime with our secure cloud infrastructure
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: '#f8f9fa',
                    borderRadius: '50%',
                    width: 100,
                    height: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <Hub sx={{ fontSize: 40, color: '#4CAF50' }} />
                </Paper>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Fully Integrated
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  All modules work seamlessly together for complete business visibility
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: '#f8f9fa',
                    borderRadius: '50%',
                    width: 100,
                    height: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <Support sx={{ fontSize: 40, color: '#2196F3' }} />
                </Paper>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  24/7 Support
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Dedicated support team ready to help you succeed with our platform
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box id="testimonials" sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            What Our Clients Say
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ backgroundColor: '#DC143C', mr: 2 }}>
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      "{testimonial.comment}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            Choose Your Plan
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  position: 'relative',
                  border: '2px solid transparent',
                  '&:hover': {
                    border: '2px solid #DC143C',
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Starter
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#DC143C', fontWeight: 'bold', mb: 1 }}>
                    Free
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Perfect for small businesses
                  </Typography>

                  <List>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary="Up to 5 users" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary="Basic modules" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary="Email support" />
                    </ListItem>
                  </List>

                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      mt: 3,
                      borderColor: '#DC143C',
                      color: '#DC143C',
                      '&:hover': { backgroundColor: '#DC143C', color: 'white' }
                    }}
                    onClick={() => navigate('/login')}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  position: 'relative',
                  border: '2px solid #DC143C',
                  transform: 'scale(1.05)'
                }}
              >
                <Chip
                  label="Most Popular"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#DC143C',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Professional
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#DC143C', fontWeight: 'bold', mb: 1 }}>
                    $99
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    per month
                  </Typography>

                  <List>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary="Up to 50 users" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary="All modules included" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary="Priority support" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary="Advanced analytics" />
                    </ListItem>
                  </List>

                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      backgroundColor: '#DC143C',
                      '&:hover': { backgroundColor: '#B91C3C' }
                    }}
                    onClick={() => setContactDialog(true)}
                  >
                    Start Trial
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  position: 'relative',
                  border: '2px solid transparent',
                  '&:hover': {
                    border: '2px solid #DC143C',
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Enterprise
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#DC143C', fontWeight: 'bold', mb: 1 }}>
                    Custom
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Tailored for your needs
                  </Typography>

                  <List>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary="Unlimited users" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary="Custom integrations" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary="Dedicated support" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary="On-premise option" />
                    </ListItem>
                  </List>

                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      mt: 3,
                      borderColor: '#DC143C',
                      color: '#DC143C',
                      '&:hover': { backgroundColor: '#DC143C', color: 'white' }
                    }}
                    onClick={() => setContactDialog(true)}
                  >
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, backgroundColor: '#DC143C', color: 'white', textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Ready to Transform Your Business?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of businesses that trust MicroSite for their operations
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: '#DC143C',
                '&:hover': { backgroundColor: '#f5f5f5' },
                px: 4,
                py: 1.5
              }}
              onClick={() => navigate('/login')}
            >
              Start Your Free Trial
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
              Schedule Demo
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Mobile Menu Dialog */}
      <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} fullScreen>
        <AppBar sx={{ position: 'relative', backgroundColor: '#DC143C' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Menu
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <List sx={{ p: 2 }}>
          <ListItem sx={{ cursor: 'pointer' }} onClick={() => { scrollToSection('solutions'); setMobileMenuOpen(false) }}>
            <ListItemText primary="Solutions" />
          </ListItem>
          <ListItem sx={{ cursor: 'pointer' }} onClick={() => { scrollToSection('industries'); setMobileMenuOpen(false) }}>
            <ListItemText primary="Industries" />
          </ListItem>
          <ListItem sx={{ cursor: 'pointer' }} onClick={() => { scrollToSection('testimonials'); setMobileMenuOpen(false) }}>
            <ListItemText primary="Testimonials" />
          </ListItem>
          <ListItem sx={{ cursor: 'pointer' }} onClick={() => { setContactDialog(true); setMobileMenuOpen(false) }}>
            <ListItemText primary="Contact" />
          </ListItem>
          <Divider sx={{ my: 2 }} />
          <ListItem>
            <Button
              fullWidth
              variant="contained"
              sx={{ backgroundColor: '#DC143C', '&:hover': { backgroundColor: '#B91C3C' } }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </ListItem>
        </List>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={contactDialog} onClose={() => setContactDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Contact Us
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Company Name"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Your Name"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Phone"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              variant="outlined"
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Contact Information
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 2, color: '#DC143C' }} />
              <Typography>hello@microsite.co.id</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ mr: 2, color: '#DC143C' }} />
              <Typography>(021) 50996750</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WhatsApp sx={{ mr: 2, color: '#25D366' }} />
              <Typography>WhatsApp Support</Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#DC143C', '&:hover': { backgroundColor: '#B91C3C' } }}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#333', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#DC143C' }}>
                🏢 MicroSite Business Solutions
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Complete business management platform for modern enterprises.
                Streamline your operations with our integrated ERP solution.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton sx={{ color: '#DC143C' }}>
                  <Email />
                </IconButton>
                <IconButton sx={{ color: '#DC143C' }}>
                  <Phone />
                </IconButton>
                <IconButton sx={{ color: '#25D366' }}>
                  <WhatsApp />
                </IconButton>
              </Stack>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Solutions
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">Accounting</Typography>
                <Typography variant="body2">Inventory</Typography>
                <Typography variant="body2">HR Management</Typography>
                <Typography variant="body2">CRM & Sales</Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Industries
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">Manufacturing</Typography>
                <Typography variant="body2">Retail</Typography>
                <Typography variant="body2">Construction</Typography>
                <Typography variant="body2">Healthcare</Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Contact Info
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">📧 hello@microsite.co.id</Typography>
                <Typography variant="body2">📞 (021) 50996750</Typography>
                <Typography variant="body2">🏢 Jakarta, Indonesia</Typography>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: '#555' }} />

          <Typography variant="body2" textAlign="center" color="text.secondary">
            © 2024 MicroSite Business Solutions. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

import { useState } from 'react'
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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider
} from '@mui/material'
import {
  Business,
  TrendingUp,
  Phone,
  Email,
  WhatsApp,
  Download,
  Menu as MenuIcon,
  CheckCircle,
  Assessment,
  People,
  AttachMoney,
  Timeline,
  Campaign
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export default function CRMLandingPage() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [contactDialog, setContactDialog] = useState(false)

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ backgroundColor: '#fff', color: '#333', boxShadow: 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#9C27B0' }}>
            🤝 MicroSite CRM & Sales
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
                sx={{ backgroundColor: '#9C27B0', '&:hover': { backgroundColor: '#7B1FA2' } }}
                onClick={() => navigate('/crm/login')}
              >
                Login to CRM
              </Button>
            </Stack>
          ) : (
            <Button onClick={() => setContactDialog(true)}>
              <MenuIcon />
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section - Tech-Development Style */}
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
                  Software CRM
                  <Box component="span" sx={{ color: '#9C27B0', display: 'block' }}>
                    Terbaik di Indonesia
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
                  Tingkatkan penjualan dengan sistem CRM terintegrasi. 
                  Kelola leads, customers, dan sales pipeline dalam satu platform.
                </Typography>

                {/* Key Benefits */}
                <Box sx={{ mb: 4 }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ color: '#9C27B0', mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Lead Management</strong> - Capture dan nurture leads otomatis
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ color: '#9C27B0', mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Sales Pipeline</strong> - Visual sales funnel dan forecasting
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ color: '#9C27B0', mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Customer 360°</strong> - Complete customer view dan history
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ 
                      backgroundColor: '#9C27B0',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#7B1FA2' }
                    }}
                    onClick={() => navigate('/crm/login')}
                  >
                    Coba Gratis Sekarang
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{ 
                      borderColor: '#9C27B0',
                      color: '#9C27B0',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': { 
                        borderColor: '#7B1FA2',
                        backgroundColor: 'rgba(156, 39, 176, 0.04)'
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
                <Typography variant="h4" sx={{ color: '#9C27B0', mb: 2, fontWeight: 'bold' }}>
                  🤝 CRM Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Interface yang powerful untuk mengelola seluruh customer journey
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
                        <Business sx={{ color: '#9C27B0', fontSize: 30, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>1,245</Typography>
                        <Typography variant="caption">Active Leads</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <AttachMoney sx={{ color: '#4CAF50', fontSize: 30, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Rp 8.5M</Typography>
                        <Typography variant="caption">Pipeline Value</Typography>
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
      <Box sx={{ backgroundColor: '#9C27B0', color: 'white', py: 1 }}>
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            justifyContent="space-between" 
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2">
              📧 CRM Support: crm@microsite.co.id
            </Typography>
            <Typography variant="body2">
              📞 Hubungi Tim CRM: (021) 50996750 ext. 104
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
              Download CRM Brochure
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Why Choose MicroSite CRM */}
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
            Mengapa Pilih Software CRM MicroSite?
          </Typography>
          <Typography 
            variant="h6" 
            textAlign="center" 
            color="text.secondary" 
            sx={{ mb: 6, fontWeight: 400 }}
          >
            Dipercaya oleh 3,000+ sales team di Indonesia untuk meningkatkan penjualan
          </Typography>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: '#9C27B0',
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
                  Sales Meningkat 40%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Automated lead nurturing dan sales pipeline management 
                  terbukti meningkatkan conversion rate dan revenue.
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
                    backgroundColor: '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <People sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Customer Retention
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  360° customer view dan automated follow-up meningkatkan 
                  customer satisfaction dan loyalty.
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
                  Sales Analytics
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Real-time sales reporting dan forecasting memberikan insights 
                  untuk optimasi strategi penjualan.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Dialog */}
      <Dialog open={contactDialog} onClose={() => setContactDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Contact CRM Team
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField fullWidth label="Company Name" variant="outlined" />
            <TextField fullWidth label="Your Name" variant="outlined" />
            <TextField fullWidth label="Email" type="email" variant="outlined" />
            <TextField fullWidth label="Phone" variant="outlined" />
            <TextField fullWidth label="CRM Requirements" multiline rows={4} variant="outlined" />
          </Stack>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            CRM Support
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 2, color: '#9C27B0' }} />
              <Typography>crm@microsite.co.id</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ mr: 2, color: '#9C27B0' }} />
              <Typography>(021) 50996750 ext. 104</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WhatsApp sx={{ mr: 2, color: '#25D366' }} />
              <Typography>WhatsApp CRM Support</Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            sx={{ backgroundColor: '#9C27B0', '&:hover': { backgroundColor: '#7B1FA2' } }}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

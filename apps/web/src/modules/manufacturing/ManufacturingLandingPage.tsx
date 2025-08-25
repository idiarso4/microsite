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
  Factory,
  Build,
  CheckCircle,
  Assignment,
  Timeline,
  Phone,
  Email,
  WhatsApp,
  Download,
  Menu as MenuIcon,
  Engineering,
  Settings,
  Assessment,
  TrendingUp,
  Schedule
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export default function ManufacturingLandingPage() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [contactDialog, setContactDialog] = useState(false)

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ backgroundColor: '#fff', color: '#333', boxShadow: 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#795548' }}>
            🏭 MicroSite Manufacturing
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
                sx={{ backgroundColor: '#795548', '&:hover': { backgroundColor: '#5D4037' } }}
                onClick={() => navigate('/manufacturing/login')}
              >
                Login to Manufacturing
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
                  Software Manufacturing
                  <Box component="span" sx={{ color: '#795548', display: 'block' }}>
                    Terdepan di Indonesia
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
                  Kelola produksi dengan sistem manufacturing terintegrasi. 
                  Dari production planning hingga quality control dalam satu platform.
                </Typography>

                {/* Key Benefits */}
                <Box sx={{ mb: 4 }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ color: '#795548', mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Production Planning</strong> - Schedule dan resource allocation
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ color: '#795548', mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Quality Control</strong> - QC checkpoints dan standards
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ color: '#795548', mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Work Orders</strong> - Production job tracking
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ 
                      backgroundColor: '#795548',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#5D4037' }
                    }}
                    onClick={() => navigate('/manufacturing/login')}
                  >
                    Coba Gratis Sekarang
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{ 
                      borderColor: '#795548',
                      color: '#795548',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': { 
                        borderColor: '#5D4037',
                        backgroundColor: 'rgba(121, 85, 72, 0.04)'
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
                <Typography variant="h4" sx={{ color: '#795548', mb: 2, fontWeight: 'bold' }}>
                  🏭 Manufacturing Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Interface yang powerful untuk mengelola seluruh proses produksi
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
                        <Factory sx={{ color: '#795548', fontSize: 30, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>85%</Typography>
                        <Typography variant="caption">Production Efficiency</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <CheckCircle sx={{ color: '#4CAF50', fontSize: 30, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>98.2%</Typography>
                        <Typography variant="caption">Quality Rate</Typography>
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
      <Box sx={{ backgroundColor: '#795548', color: 'white', py: 1 }}>
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            justifyContent="space-between" 
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2">
              📧 Manufacturing Support: manufacturing@microsite.co.id
            </Typography>
            <Typography variant="body2">
              📞 Hubungi Tim Manufacturing: (021) 50996750 ext. 105
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
              Download Manufacturing Brochure
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Why Choose MicroSite Manufacturing */}
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
            Mengapa Pilih Software Manufacturing MicroSite?
          </Typography>
          <Typography 
            variant="h6" 
            textAlign="center" 
            color="text.secondary" 
            sx={{ mb: 6, fontWeight: 400 }}
          >
            Dipercaya oleh 2,000+ pabrik di Indonesia untuk mengoptimalkan produksi
          </Typography>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: '#795548',
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
                  Efisiensi Produksi +30%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Optimasi production planning dan resource allocation 
                  meningkatkan efisiensi produksi hingga 30%.
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
                  <CheckCircle sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Quality Assurance
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sistem quality control terintegrasi memastikan 
                  standar kualitas produk terjaga konsisten.
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
                  Real-time Monitoring
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Dashboard real-time memberikan visibility penuh 
                  terhadap seluruh proses produksi dan performance.
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
            Contact Manufacturing Team
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField fullWidth label="Company Name" variant="outlined" />
            <TextField fullWidth label="Your Name" variant="outlined" />
            <TextField fullWidth label="Email" type="email" variant="outlined" />
            <TextField fullWidth label="Phone" variant="outlined" />
            <TextField fullWidth label="Manufacturing Requirements" multiline rows={4} variant="outlined" />
          </Stack>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Manufacturing Support
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 2, color: '#795548' }} />
              <Typography>manufacturing@microsite.co.id</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ mr: 2, color: '#795548' }} />
              <Typography>(021) 50996750 ext. 105</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WhatsApp sx={{ mr: 2, color: '#25D366' }} />
              <Typography>WhatsApp Manufacturing Support</Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            sx={{ backgroundColor: '#795548', '&:hover': { backgroundColor: '#5D4037' } }}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

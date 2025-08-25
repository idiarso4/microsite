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
  People,
  AttachMoney,
  Schedule,
  Assessment,
  CheckCircle,
  Phone,
  Email,
  WhatsApp,
  Download,
  Menu as MenuIcon,
  Work,
  TrendingUp,
  Group,
  PersonAdd
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export default function HRLandingPage() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [contactDialog, setContactDialog] = useState(false)

  const hrFeatures = [
    {
      icon: <People sx={{ fontSize: 40, color: '#2196F3' }} />,
      title: 'Employee Database',
      description: 'Kelola data karyawan lengkap dengan sistem HRIS terintegrasi dan self-service portal.',
      features: ['Employee Self Service', 'Digital Personnel Files', 'Organization Chart', 'Employee Directory']
    },
    {
      icon: <AttachMoney sx={{ fontSize: 40, color: '#4CAF50' }} />,
      title: 'Payroll Management',
      description: 'Sistem payroll otomatis dengan perhitungan gaji, tunjangan, dan potongan yang akurat.',
      features: ['Automated Payroll', 'Tax Calculations', 'Benefits Management', 'Salary Slips']
    },
    {
      icon: <Schedule sx={{ fontSize: 40, color: '#FF9800' }} />,
      title: 'Time & Attendance',
      description: 'Tracking kehadiran real-time dengan integrasi fingerprint dan mobile check-in.',
      features: ['Biometric Integration', 'Mobile Check-in', 'Overtime Tracking', 'Shift Management']
    },
    {
      icon: <Assessment sx={{ fontSize: 40, color: '#9C27B0' }} />,
      title: 'Performance Management',
      description: 'Sistem penilaian kinerja 360° dengan goal setting dan performance review.',
      features: ['360° Performance Review', 'Goal Setting & KPI', 'Performance Analytics', 'Career Development']
    },
    {
      icon: <Work sx={{ fontSize: 40, color: '#607D8B' }} />,
      title: 'Recruitment',
      description: 'ATS (Applicant Tracking System) untuk streamline proses recruitment dan hiring.',
      features: ['Job Posting', 'Candidate Tracking', 'Interview Scheduling', 'Onboarding Process']
    },
    {
      icon: <Group sx={{ fontSize: 40, color: '#795548' }} />,
      title: 'Training & Development',
      description: 'Learning Management System untuk employee development dan skill enhancement.',
      features: ['Training Programs', 'Skill Assessment', 'Certification Tracking', 'Learning Analytics']
    }
  ]

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ backgroundColor: '#fff', color: '#333', boxShadow: 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#2196F3' }}>
            👥 MicroSite Human Resources
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
                sx={{ backgroundColor: '#2196F3', '&:hover': { backgroundColor: '#1976D2' } }}
                onClick={() => navigate('/hr/login')}
              >
                Login to HR System
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
                  Software HR
                  <Box component="span" sx={{ color: '#2196F3', display: 'block' }}>
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
                  Kelola SDM perusahaan dengan sistem HRIS terintegrasi. 
                  Dari recruitment hingga payroll dalam satu platform yang powerful.
                </Typography>

                {/* Key Benefits */}
                <Box sx={{ mb: 4 }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ color: '#2196F3', mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Payroll Otomatis</strong> - Perhitungan gaji, pajak, dan tunjangan
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ color: '#2196F3', mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Employee Self Service</strong> - Portal mandiri untuk karyawan
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ color: '#2196F3', mr: 2 }} />
                      <Typography variant="body1">
                        <strong>Performance Management</strong> - Penilaian kinerja 360°
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ 
                      backgroundColor: '#2196F3',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#1976D2' }
                    }}
                    onClick={() => navigate('/hr/login')}
                  >
                    Coba Gratis Sekarang
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{ 
                      borderColor: '#2196F3',
                      color: '#2196F3',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': { 
                        borderColor: '#1976D2',
                        backgroundColor: 'rgba(33, 150, 243, 0.04)'
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
                <Typography variant="h4" sx={{ color: '#2196F3', mb: 2, fontWeight: 'bold' }}>
                  👥 HR Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Interface yang user-friendly untuk mengelola seluruh aspek SDM
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
                        <People sx={{ color: '#2196F3', fontSize: 30, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>245</Typography>
                        <Typography variant="caption">Total Employees</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <AttachMoney sx={{ color: '#4CAF50', fontSize: 30, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>98.5%</Typography>
                        <Typography variant="caption">Attendance Rate</Typography>
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
      <Box sx={{ backgroundColor: '#2196F3', color: 'white', py: 1 }}>
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            justifyContent="space-between" 
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2">
              📧 HR Support: hr@microsite.co.id
            </Typography>
            <Typography variant="body2">
              📞 Hubungi Tim HR: (021) 50996750 ext. 103
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
              Download HR Brochure
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Why Choose MicroSite HR */}
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
            Mengapa Pilih Software HR MicroSite?
          </Typography>
          <Typography 
            variant="h6" 
            textAlign="center" 
            color="text.secondary" 
            sx={{ mb: 6, fontWeight: 400 }}
          >
            Dipercaya oleh 5,000+ perusahaan di Indonesia untuk mengelola SDM mereka
          </Typography>

          <Grid container spacing={4} sx={{ mb: 8 }}>
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
                  <People sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Employee Experience
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Self-service portal yang memudahkan karyawan mengakses informasi pribadi, 
                  mengajukan cuti, dan melihat slip gaji secara mandiri.
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
                  <TrendingUp sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Produktivitas Meningkat
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Otomatisasi proses HR mengurangi beban administratif hingga 80%. 
                  Tim HR dapat fokus pada strategic initiatives.
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
                  Data-Driven Decisions
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  HR analytics dan reporting yang comprehensive memberikan insights 
                  untuk pengambilan keputusan strategis tentang SDM.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Dialog */}
      <Dialog open={contactDialog} onClose={() => setContactDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Konsultasi Gratis HR Solution
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Dapatkan konsultasi gratis untuk kebutuhan HR management perusahaan Anda.
          </Typography>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Nama Perusahaan"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Nama Lengkap"
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
              label="Nomor Telepon"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Jumlah Karyawan"
              variant="outlined"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialog(false)}>
            Batal
          </Button>
          <Button
            variant="contained"
            onClick={() => setContactDialog(false)}
            sx={{ backgroundColor: '#2196F3' }}
          >
            Kirim Permintaan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

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
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// Using emoji icons instead of @mui/icons-material to avoid dependency issues
const icons = {
  business: '🏢',
  inventory: '📦',
  accounting: '💰',
  hr: '👥',
  reports: '📊',
  security: '🔒'
}

// Header Component
function Header() {
  const navigate = useNavigate()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#fff', color: '#333', boxShadow: 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#DC143C' }}>
          🏢 ERP Platform
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            color="inherit"
            sx={{
              color: '#333',
              '&:hover': {
                color: '#DC143C',
                background: 'linear-gradient(90deg, #DC143C 0%, #1A1A1A 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }
            }}
            onClick={() => scrollToSection('features')}
          >
            Solusi
          </Button>
          <Button
            color="inherit"
            sx={{
              color: '#333',
              '&:hover': {
                color: '#DC143C',
                background: 'linear-gradient(90deg, #DC143C 0%, #1A1A1A 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }
            }}
            onClick={() => scrollToSection('pricing')}
          >
            Harga
          </Button>
          <Button
            color="inherit"
            sx={{
              color: '#333',
              '&:hover': {
                color: '#DC143C',
                background: 'linear-gradient(90deg, #DC143C 0%, #1A1A1A 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }
            }}
            onClick={() => scrollToSection('faq')}
          >
            FAQ
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/login')}
            sx={{
              borderColor: '#DC143C',
              color: '#DC143C',
              '&:hover': {
                backgroundColor: '#DC143C',
                color: 'white',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(220, 20, 60, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Masuk
          </Button>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(220, 20, 60, 0.5)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Demo Gratis
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

// Hero Section
function HeroSection() {
  return (
    <Box sx={{
      background: 'linear-gradient(135deg, #1A1A1A 0%, #DC143C 50%, #1A1A1A 100%)',
      py: 12,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(220, 20, 60, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(26, 26, 26, 0.3) 0%, transparent 50%)',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: 'white',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                animation: 'slideInLeft 1s ease-out'
              }}
            >
              Sistem ERP Terlengkap untuk Bisnis Indonesia
            </Typography>
            <Typography
              variant="h6"
              paragraph
              sx={{
                color: 'rgba(255,255,255,0.95)',
                mb: 4,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                lineHeight: 1.6,
                animation: 'slideInLeft 1s ease-out 0.2s both'
              }}
            >
              Kelola seluruh operasional bisnis Anda dengan satu platform terintegrasi.
              Tingkatkan efisiensi dan produktivitas dengan solusi ERP yang mudah digunakan.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ animation: 'slideInLeft 1s ease-out 0.4s both' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: 'white',
                  color: '#DC143C',
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: '#f8f9fa',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Coba Demo Gratis
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  borderRadius: 3,
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 25px rgba(255,255,255,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Konsultasi Gratis
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center', animation: 'slideInRight 1s ease-out 0.6s both' }}>
              <Box
                sx={{
                  width: '100%',
                  height: { xs: 300, md: 400 },
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                    animation: 'shimmer 3s infinite'
                  }
                }}
              >
                <Typography variant="h4" sx={{ color: 'white', opacity: 0.9, fontWeight: 'bold' }}>
                  📊 Dashboard Preview
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Add keyframes for animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </Box>
  )
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: icons.business,
      title: 'CRM & Sales',
      description: 'Kelola pelanggan, lead, dan pipeline penjualan dengan mudah'
    },
    {
      icon: icons.inventory,
      title: 'Inventory Management',
      description: 'Kontrol stok barang real-time dengan sistem multi-gudang'
    },
    {
      icon: icons.accounting,
      title: 'Accounting',
      description: 'Pembukuan otomatis dan laporan keuangan yang akurat'
    },
    {
      icon: icons.hr,
      title: 'Human Resources',
      description: 'Manajemen karyawan, payroll, dan absensi terintegrasi'
    },
    {
      icon: icons.reports,
      title: 'Reports & Analytics',
      description: 'Dashboard dan laporan bisnis yang komprehensif'
    },
    {
      icon: icons.security,
      title: 'Security',
      description: 'Keamanan data tingkat enterprise dengan enkripsi'
    }
  ]

  return (
    <Box id="features" sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          Solusi Lengkap untuk Semua Kebutuhan Bisnis
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  boxShadow: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid rgba(220, 20, 60, 0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(220, 20, 60, 0.15)',
                    border: '1px solid rgba(220, 20, 60, 0.3)',
                    background: 'linear-gradient(145deg, #ffffff 0%, #ffe6e6 100%)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 3, fontSize: '3rem' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

// Stats Section
function StatsSection() {
  return (
    <Box sx={{ backgroundColor: '#f8f9fa', py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Dipercaya oleh Ribuan Perusahaan
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Bergabunglah dengan komunitas bisnis yang telah merasakan manfaatnya
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={6} md={3}>
            <Box textAlign="center" sx={{
              '&:hover': { transform: 'translateY(-5px)' },
              transition: 'all 0.3s ease'
            }}>
              <Typography
                variant="h2"
                sx={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}
              >
                1000+
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 'medium' }}>
                Perusahaan Aktif
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center" sx={{
              '&:hover': { transform: 'translateY(-5px)' },
              transition: 'all 0.3s ease'
            }}>
              <Typography
                variant="h2"
                sx={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}
              >
                99.9%
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 'medium' }}>
                Uptime Guarantee
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center" sx={{
              '&:hover': { transform: 'translateY(-5px)' },
              transition: 'all 0.3s ease'
            }}>
              <Typography
                variant="h2"
                sx={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}
              >
                50%
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 'medium' }}>
                Peningkatan Efisiensi
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center" sx={{
              '&:hover': { transform: 'translateY(-5px)' },
              transition: 'all 0.3s ease'
            }}>
              <Typography
                variant="h2"
                sx={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}
              >
                24/7
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 'medium' }}>
                Support Premium
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Trusted Companies */}
        <Box textAlign="center">
          <Typography variant="h6" gutterBottom sx={{ color: '#666', mb: 3 }}>
            Dipercaya oleh perusahaan terkemuka
          </Typography>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            {['PT Maju Bersama', 'CV Sukses Mandiri', 'PT Teknologi Nusantara', 'PT Digital Indonesia', 'CV Inovasi Bisnis'].map((company, index) => (
              <Grid item xs={6} md={2} key={index}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 60
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#666', textAlign: 'center' }}>
                    {company}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

// Testimonial Section
function TestimonialSection() {
  const testimonials = [
    {
      name: 'Budi Santoso',
      position: 'CEO, PT Maju Bersama',
      content: 'Platform ERP ini sangat membantu mengintegrasikan semua departemen kami. Efisiensi meningkat drastis dalam 3 bulan pertama.'
    },
    {
      name: 'Sari Dewi',
      position: 'Finance Manager, CV Sukses Mandiri',
      content: 'Laporan keuangan yang akurat dan real-time membantu kami membuat keputusan bisnis yang lebih baik dan cepat.'
    },
    {
      name: 'Ahmad Rahman',
      position: 'Operations Director, PT Teknologi Nusantara',
      content: 'Implementasi yang mudah dan support team yang responsif. Highly recommended untuk perusahaan yang ingin berkembang.'
    }
  ]

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          Apa Kata Klien Kami
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{
                height: '100%',
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid rgba(123, 0, 255, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 24px rgba(123, 0, 255, 0.1)',
                  border: '1px solid rgba(123, 0, 255, 0.2)'
                }
              }}>
                <CardContent>
                  <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', mb: 3 }}>
                    "{testimonial.content}"
                  </Typography>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.position}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

// Pricing Section
function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: 'Rp 299.000',
      period: '/bulan',
      features: [
        'Hingga 5 pengguna',
        'Modul CRM & Sales',
        'Inventory Management',
        'Laporan Dasar',
        'Support Email'
      ]
    },
    {
      name: 'Professional',
      price: 'Rp 599.000',
      period: '/bulan',
      features: [
        'Hingga 25 pengguna',
        'Semua modul tersedia',
        'Advanced Analytics',
        'API Integration',
        'Priority Support'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Unlimited pengguna',
        'Custom Development',
        'Dedicated Server',
        'SLA 99.9%',
        '24/7 Phone Support'
      ]
    }
  ]

  return (
    <Box id="pricing" sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          Pilih Paket yang Sesuai
        </Typography>
        <Grid container spacing={4}>
          {plans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  position: 'relative',
                  border: plan.popular ? 2 : 1,
                  borderColor: plan.popular ? '#DC143C' : '#e0e0e0',
                  boxShadow: plan.popular ? '0 8px 32px rgba(220, 20, 60, 0.2)' : 2
                }}
              >
                {plan.popular && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.875rem'
                    }}
                  >
                    POPULER
                  </Box>
                )}
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {plan.name}
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold'
                    }}
                  >
                    {plan.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {plan.period}
                  </Typography>
                  <Stack spacing={1} sx={{ mb: 3 }}>
                    {plan.features.map((feature, idx) => (
                      <Typography key={idx} variant="body2">
                        ✓ {feature}
                      </Typography>
                    ))}
                  </Stack>
                  <Button
                    variant={plan.popular ? "contained" : "outlined"}
                    fullWidth
                    size="large"
                    sx={{
                      background: plan.popular ? 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)' : 'transparent',
                      borderColor: '#DC143C',
                      color: plan.popular ? 'white' : '#DC143C',
                      '&:hover': {
                        background: plan.popular ? 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)' : 'rgba(220, 20, 60, 0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(220, 20, 60, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Pilih Paket
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

// FAQ Section
function FAQSection() {
  const faqs = [
    {
      question: 'Apakah sistem ERP ini cocok untuk bisnis kecil?',
      answer: 'Ya, kami menyediakan paket Starter yang dirancang khusus untuk bisnis kecil dengan harga terjangkau dan fitur yang sesuai kebutuhan.'
    },
    {
      question: 'Berapa lama waktu implementasi sistem?',
      answer: 'Implementasi biasanya memakan waktu 2-4 minggu tergantung kompleksitas bisnis. Tim kami akan membantu proses migrasi data dan training.'
    },
    {
      question: 'Apakah data saya aman?',
      answer: 'Keamanan data adalah prioritas utama. Kami menggunakan enkripsi tingkat bank dan backup otomatis untuk melindungi data bisnis Anda.'
    },
    {
      question: 'Bisakah sistem ini diintegrasikan dengan software lain?',
      answer: 'Ya, sistem kami mendukung API integration dengan berbagai software populer seperti e-commerce, payment gateway, dan aplikasi bisnis lainnya.'
    },
    {
      question: 'Apakah tersedia support dalam bahasa Indonesia?',
      answer: 'Tentu! Tim support kami berbahasa Indonesia dan siap membantu Anda 24/7 melalui chat, email, dan telepon.'
    }
  ]

  return (
    <Box id="faq" sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          Pertanyaan yang Sering Diajukan
        </Typography>
        <Stack spacing={2}>
          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ boxShadow: 1 }}>
              <AccordionSummary expandIcon={<Box sx={{ fontSize: '1.5rem' }}>▼</Box>}>
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Container>
    </Box>
  )
}

// CTA Section
function CTASection() {
  return (
    <Box sx={{
      background: 'linear-gradient(135deg, #1A1A1A 0%, #DC143C 50%, #1A1A1A 100%)',
      py: 10,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 70%, rgba(220, 20, 60, 0.2) 0%, transparent 50%)',
          animation: 'float 8s ease-in-out infinite'
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box textAlign="center">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              mb: 3
            }}
          >
            Siap Mengoptimalkan Bisnis Anda?
          </Typography>
          <Typography
            variant="h6"
            paragraph
            sx={{
              color: 'rgba(255,255,255,0.95)',
              mb: 5,
              fontSize: '1.2rem',
              lineHeight: 1.6
            }}
          >
            Bergabunglah dengan ribuan perusahaan yang telah mempercayai platform kami
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: '#DC143C',
                px: 5,
                py: 2,
                fontWeight: 'bold',
                borderRadius: 3,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Mulai Sekarang
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 5,
                py: 2,
                fontWeight: 'bold',
                borderRadius: 3,
                borderWidth: 2,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(255,255,255,0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Hubungi Sales
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

// Footer
function Footer() {
  return (
    <Box sx={{ backgroundColor: '#333', color: 'white', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              ERP Platform
            </Typography>
            <Typography variant="body2">
              Solusi ERP terdepan untuk bisnis Indonesia dengan teknologi cloud terkini.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Produk
            </Typography>
            <Typography variant="body2" paragraph>CRM & Sales</Typography>
            <Typography variant="body2" paragraph>Inventory</Typography>
            <Typography variant="body2" paragraph>Accounting</Typography>
            <Typography variant="body2">Human Resources</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Kontak
            </Typography>
            <Typography variant="body2" paragraph>Email: info@erpplatform.id</Typography>
            <Typography variant="body2" paragraph>Phone: +62 21 1234 5678</Typography>
            <Typography variant="body2">Jakarta, Indonesia</Typography>
          </Grid>
        </Grid>
        <Box sx={{ borderTop: 1, borderColor: '#555', mt: 4, pt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            © 2024 ERP Platform. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

// Main Landing Page Component
export default function LandingPage() {
  return (
    <Box>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </Box>
  )
}

import { useState } from 'react'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '../../contexts/AuthContext'
import { loginSchema, LoginFormData } from '../../utils/validationSchemas'
import FormTextField from '../forms/FormTextField'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  CircularProgress
} from '@mui/material'
import { Visibility, VisibilityOff, Email, Lock, PlayArrow } from '@mui/icons-material'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginDemo, isLoading: authLoading } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Get selected module from URL params
  const searchParams = new URLSearchParams(location.search)
  const selectedModule = searchParams.get('module')

  const moduleInfo = {
    'finance': { name: 'Accounting & Finance', path: '/finance', color: '#DC143C' },
    'inventory': { name: 'Inventory Management', path: '/inventory', color: '#4CAF50' },
    'hr': { name: 'Human Resources', path: '/hr', color: '#2196F3' },
    'crm': { name: 'Sales & CRM', path: '/crm', color: '#FF9800' },
    'manufacturing': { name: 'Manufacturing', path: '/orders', color: '#9C27B0' },
    'procurement': { name: 'Supply Chain', path: '/procurement', color: '#607D8B' },
    'analytics': { name: 'Business Intelligence', path: '/analytics', color: '#795548' },
    'reports': { name: 'Reports & Export', path: '/reports', color: '#3F51B5' }
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError('')

    try {
      await login(data.email, data.password)

      // Redirect based on selected module or default to dashboard
      if (selectedModule && moduleInfo[selectedModule as keyof typeof moduleInfo]) {
        const targetPath = moduleInfo[selectedModule as keyof typeof moduleInfo].path
        navigate(`/dashboard${targetPath}`, { replace: true })
      } else {
        const from = location.state?.from?.pathname || '/dashboard'
        navigate(from, { replace: true })
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    loginDemo()
    navigate('/dashboard', { replace: true })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1A1A1A 0%, #DC143C 50%, #1A1A1A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid rgba(220, 20, 60, 0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              🏢 ERP Platform
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Masuk ke Dashboard Admin
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kelola sistem ERP Anda dengan mudah
            </Typography>
          </Box>

          {/* Selected Module Info */}
          {selectedModule && moduleInfo[selectedModule as keyof typeof moduleInfo] && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                backgroundColor: 'rgba(220, 20, 60, 0.05)',
                borderRadius: 2,
                border: '1px solid rgba(220, 20, 60, 0.2)'
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                You selected:
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: moduleInfo[selectedModule as keyof typeof moduleInfo].color,
                  fontWeight: 'bold'
                }}
              >
                {moduleInfo[selectedModule as keyof typeof moduleInfo].name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Login to access this module directly
              </Typography>
            </Box>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Demo Mode Button */}
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<PlayArrow />}
            onClick={handleDemoLogin}
            sx={{
              mb: 3,
              py: 1.5,
              borderColor: '#f97316',
              color: '#f97316',
              '&:hover': {
                borderColor: '#ea580c',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(249, 115, 22, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Coba Demo Gratis
          </Button>

          {/* Demo Credentials Info */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Demo Credentials:</strong><br />
              Email: admin@erp.com<br />
              Password: admin123
            </Typography>
          </Alert>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <FormTextField
              name="email"
              control={control}
              label="Email"
              type="email"
              placeholder="Masukkan email Anda"
              margin="normal"
              startAdornment={
                <InputAdornment position="start">
                  <Email sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />

            <FormTextField
              name="password"
              control={control}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan password Anda"
              margin="normal"
              startAdornment={
                <InputAdornment position="start">
                  <Lock sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || isSubmitting}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(220, 20, 60, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {(loading || isSubmitting) ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Masuk...
                </>
              ) : (
                'Masuk'
              )}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                atau
              </Typography>
            </Divider>

            <Stack spacing={2}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: '#DC143C',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Lupa password?
              </Link>
              
              <Typography variant="body2" textAlign="center" color="text.secondary">
                Belum punya akun?{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{
                    color: '#DC143C',
                    textDecoration: 'none',
                    fontWeight: 'medium',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Daftar sekarang
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

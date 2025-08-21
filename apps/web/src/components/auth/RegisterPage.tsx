import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '../../contexts/AuthContext'
import { registerSchema, RegisterFormData } from '../../utils/validationSchemas'
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
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent
} from '@mui/material'
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Person,
  Business,
  CheckCircle,
  ArrowBack
} from '@mui/icons-material'

const steps = ['Informasi Akun', 'Informasi Perusahaan', 'Konfirmasi']

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading: authLoading } = useAuth()

  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    watch,
    trigger
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange'
  })

  const watchedFields = watch()

  const handleNext = async () => {
    let fieldsToValidate: (keyof RegisterFormData)[] = []
    
    if (activeStep === 0) {
      fieldsToValidate = ['name', 'email']
    } else if (activeStep === 1) {
      fieldsToValidate = ['password', 'confirmPassword']
    }

    const isStepValid = await trigger(fieldsToValidate)
    
    if (isStepValid) {
      setActiveStep((prevStep) => prevStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true)
    setError('')

    try {
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
        company: data.company
      })

      // Redirect to dashboard after successful registration
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <TextField
              {...formRegister('name')}
              fullWidth
              label="Nama Lengkap"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              {...formRegister('email')}
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        )

      case 1:
        return (
          <Stack spacing={3}>
            <TextField
              {...formRegister('company')}
              fullWidth
              label="Nama Perusahaan (Opsional)"
              variant="outlined"
              error={!!errors.company}
              helperText={errors.company?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              {...formRegister('password')}
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              {...formRegister('confirmPassword')}
              fullWidth
              label="Konfirmasi Password"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        )

      case 2:
        return (
          <Card sx={{ backgroundColor: '#f8f9fa' }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="success" />
                  Konfirmasi Data Pendaftaran
                </Typography>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nama Lengkap
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {watchedFields.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {watchedFields.email}
                  </Typography>
                </Box>
                {watchedFields.company && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Perusahaan
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {watchedFields.company}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Container maxWidth="md">
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
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/login')}
              sx={{ 
                position: 'absolute',
                top: 20,
                left: 20,
                color: '#64748b'
              }}
            >
              Kembali ke Login
            </Button>
            
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
              🏢 Daftar Akun Baru
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Bergabung dengan Platform ERP Terdepan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kelola bisnis Anda dengan sistem terintegrasi
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                sx={{ px: 4 }}
              >
                Kembali
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || authLoading}
                  sx={{
                    px: 4,
                    background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                    }
                  }}
                >
                  {loading || authLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Daftar Sekarang'
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{
                    px: 4,
                    background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                    }
                  }}
                >
                  Lanjutkan
                </Button>
              )}
            </Box>
          </form>

          {/* Footer */}
          <Divider sx={{ my: 3 }} />
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Sudah punya akun?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: '#DC143C',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Masuk di sini
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

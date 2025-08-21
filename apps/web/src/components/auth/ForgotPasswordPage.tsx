import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
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
  Stack,
  CircularProgress
} from '@mui/material'
import { Email, ArrowBack, CheckCircle } from '@mui/icons-material'

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email wajib diisi')
    .email('Format email tidak valid')
    .trim()
})

type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema)
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true)
    setError('')

    try {
      // Simulate API call for forgot password
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demo purposes, always show success
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengirim email reset password')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}>
        <Container maxWidth="sm">
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(220, 20, 60, 0.1)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}
          >
            <CheckCircle sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
            
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: '#1e293b'
              }}
            >
              Email Terkirim!
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Kami telah mengirim link reset password ke email:
            </Typography>
            
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 4, color: '#DC143C' }}>
              {getValues('email')}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Silakan cek inbox email Anda dan ikuti instruksi untuk reset password. 
              Link akan expired dalam 24 jam.
            </Typography>

            <Stack spacing={2}>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                  }
                }}
              >
                Kembali ke Login
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => setSuccess(false)}
                sx={{
                  borderColor: '#DC143C',
                  color: '#DC143C',
                  '&:hover': {
                    borderColor: '#B91C3C',
                    backgroundColor: 'rgba(220, 20, 60, 0.1)'
                  }
                }}
              >
                Kirim Ulang Email
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    )
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
              Kembali
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
              🔐 Reset Password
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Lupa Password Anda?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Masukkan email Anda dan kami akan mengirim link untuk reset password
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Info Alert */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Pastikan email yang Anda masukkan adalah email yang terdaftar di sistem kami.
            </Typography>
          </Alert>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('email')}
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              placeholder="Masukkan email Anda"
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#DC143C' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
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
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Mengirim Email...
                </>
              ) : (
                'Kirim Link Reset Password'
              )}
            </Button>
          </Box>

          {/* Footer */}
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Ingat password Anda?{' '}
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

import React, { useState } from 'react'
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stack,
  Divider,
  Card,
  CardContent,
  Grid
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  AccountBalance,
  Receipt,
  TrendingUp,
  CreditCard,
  ArrowBack
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../../utils/validationSchemas'

export default function AccountingLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading: authLoading } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError('')

    try {
      await login(data.email, data.password)
      
      // Redirect to accounting dashboard
      navigate('/dashboard/finance', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const accountingFeatures = [
    {
      icon: <AccountBalance sx={{ color: '#4CAF50' }} />,
      title: 'General Ledger',
      description: 'Complete chart of accounts'
    },
    {
      icon: <Receipt sx={{ color: '#2196F3' }} />,
      title: 'A/P & A/R',
      description: 'Vendor & customer management'
    },
    {
      icon: <TrendingUp sx={{ color: '#FF9800' }} />,
      title: 'Financial Reports',
      description: 'P&L, Balance Sheet, Cash Flow'
    },
    {
      icon: <CreditCard sx={{ color: '#9C27B0' }} />,
      title: 'Tax Management',
      description: 'VAT & income tax calculations'
    }
  ]

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={24}
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* Back Button */}
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/accounting')}
                sx={{ mb: 3, color: '#4CAF50' }}
              >
                Back to Accounting
              </Button>

              {/* Header */}
              <Box textAlign="center" mb={4}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                  💰 Accounting Login
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Access your accounting & finance system
                </Typography>
              </Box>

              {/* Accounting Module Info */}
              <Box 
                sx={{ 
                  mb: 3, 
                  p: 2, 
                  backgroundColor: 'rgba(76, 175, 80, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(76, 175, 80, 0.2)'
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  You are accessing:
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#4CAF50',
                    fontWeight: 'bold'
                  }}
                >
                  Accounting & Finance Module
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Complete financial management system
                </Typography>
              </Box>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {/* Login Form */}
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  margin="normal"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#4CAF50'
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#4CAF50'
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  margin="normal"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#4CAF50'
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#4CAF50'
                    }
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    backgroundColor: '#4CAF50',
                    '&:hover': {
                      backgroundColor: '#388E3C'
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Login to Accounting'
                  )}
                </Button>

                <Box textAlign="center">
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/forgot-password')}
                    sx={{ color: '#4CAF50' }}
                  >
                    Forgot password?
                  </Link>
                </Box>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    or
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/register')}
                  sx={{
                    borderColor: '#4CAF50',
                    color: '#4CAF50',
                    '&:hover': {
                      borderColor: '#388E3C',
                      backgroundColor: 'rgba(76, 175, 80, 0.04)'
                    }
                  }}
                >
                  Create New Account
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Right Side - Accounting Features */}
          <Grid item xs={12} md={6}>
            <Box sx={{ color: 'white', pl: { md: 4 } }}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Accounting & Finance Features
              </Typography>
              
              <Grid container spacing={3}>
                {accountingFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white'
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ mb: 2 }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 4, p: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Why Choose MicroSite Accounting?
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">✓ Real-time financial reporting</Typography>
                  <Typography variant="body2">✓ Automated tax calculations</Typography>
                  <Typography variant="body2">✓ Multi-currency support</Typography>
                  <Typography variant="body2">✓ Bank reconciliation</Typography>
                  <Typography variant="body2">✓ Audit trail & compliance</Typography>
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

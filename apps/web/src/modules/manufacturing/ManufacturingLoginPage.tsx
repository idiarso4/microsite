import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Link,
  Divider,
  Stack,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import {
  Build,
  Visibility,
  VisibilityOff,
  ArrowBack
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function ManufacturingLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      navigate('/dashboard/manufacturing')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Container maxWidth="sm">
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)',
            color: 'white',
            p: 4,
            textAlign: 'center'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 2
            }}>
              <Build sx={{ fontSize: 48, mr: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Manufacturing
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Production Management System
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
              Kelola produksi dengan sistem yang terintegrasi
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {/* Back Button */}
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/manufacturing')}
              sx={{ 
                mb: 3,
                color: '#607D8B',
                '&:hover': { backgroundColor: 'rgba(96, 125, 139, 0.04)' }
              }}
            >
              Back to Manufacturing Info
            </Button>

            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 'bold',
              color: '#333',
              mb: 3
            }}>
              Login to Manufacturing System
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#607D8B',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#607D8B',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#607D8B',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#607D8B',
                    },
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{
                          color: '#607D8B',
                          '&.Mui-checked': {
                            color: '#607D8B',
                          },
                        }}
                      />
                    }
                    label="Remember me"
                  />
                  <Link href="#" sx={{ color: '#607D8B', textDecoration: 'none' }}>
                    Forgot password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)',
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #455A64 0%, #37474F 100%)',
                    },
                    '&:disabled': {
                      background: '#ccc',
                    }
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In to Manufacturing'}
                </Button>
              </Stack>
            </form>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link href="#" sx={{ color: '#607D8B', textDecoration: 'none' }}>
                  Contact Sales
                </Link>
              </Typography>
            </Box>

            {/* Demo Credentials */}
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              backgroundColor: '#f8f9fa', 
              borderRadius: 2,
              border: '1px solid #e0e0e0'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Demo Credentials:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: manufacturing@microsite.com<br />
                Password: manufacturing123
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

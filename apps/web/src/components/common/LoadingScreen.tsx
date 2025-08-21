import React from 'react'
import {
  Box,
  CircularProgress,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Stack
} from '@mui/material'
import { Security, Dashboard, AccountBalance } from '@mui/icons-material'

interface LoadingScreenProps {
  message?: string
  type?: 'auth' | 'dashboard' | 'page'
  showProgress?: boolean
}

export default function LoadingScreen({ 
  message = 'Loading...', 
  type = 'page',
  showProgress = false 
}: LoadingScreenProps) {
  const getIcon = () => {
    switch (type) {
      case 'auth':
        return <Security sx={{ fontSize: 60, color: '#DC143C', mb: 2 }} />
      case 'dashboard':
        return <Dashboard sx={{ fontSize: 60, color: '#DC143C', mb: 2 }} />
      default:
        return <AccountBalance sx={{ fontSize: 60, color: '#DC143C', mb: 2 }} />
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'auth':
        return 'Authenticating...'
      case 'dashboard':
        return 'Loading Dashboard...'
      default:
        return 'Loading...'
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid rgba(220, 20, 60, 0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="center">
            {getIcon()}
            
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {getTitle()}
            </Typography>
            
            <Typography variant="body1" color="text.secondary">
              {message}
            </Typography>
            
            <Box sx={{ width: '100%' }}>
              {showProgress ? (
                <LinearProgress
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#DC143C20',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#DC143C'
                    }
                  }}
                />
              ) : (
                <CircularProgress
                  size={40}
                  sx={{
                    color: '#DC143C'
                  }}
                />
              )}
            </Box>
            
            <Typography variant="caption" color="text.secondary">
              Please wait while we prepare everything for you...
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

// Specific loading components
export const AuthLoadingScreen: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingScreen type="auth" message={message || 'Checking your credentials...'} />
)

export const DashboardLoadingScreen: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingScreen type="dashboard" message={message || 'Setting up your workspace...'} showProgress />
)

export const PageLoadingScreen: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingScreen type="page" message={message || 'Loading content...'} />
)

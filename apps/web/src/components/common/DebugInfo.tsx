import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Collapse,
  Chip,
  Stack,
  Divider,
  Alert,
  IconButton
} from '@mui/material'
import {
  BugReport,
  ExpandMore,
  ExpandLess,
  Refresh,
  Delete,
  Info
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { TokenService, SessionService } from '../../services/tokenService'

interface DebugInfoProps {
  show?: boolean
}

export default function DebugInfo({ show = process.env.NODE_ENV === 'development' }: DebugInfoProps) {
  const [expanded, setExpanded] = useState(false)
  const { user, isAuthenticated, isLoading, isDemoMode } = useAuth()

  if (!show) return null

  const sessionInfo = SessionService.getSessionInfo()
  const token = TokenService.getAccessToken()
  const refreshToken = TokenService.getRefreshToken()

  const handleClearTokens = () => {
    TokenService.clearTokens()
    window.location.reload()
  }

  const handleRefreshSession = async () => {
    try {
      await SessionService.refreshToken()
      window.location.reload()
    } catch (error) {
      console.error('Failed to refresh session:', error)
    }
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        maxWidth: 400
      }}
    >
      <Card
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          border: '1px solid #DC143C'
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            onClick={() => setExpanded(!expanded)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BugReport sx={{ color: '#DC143C' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Debug Info
              </Typography>
            </Box>
            <IconButton size="small" sx={{ color: 'white' }}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={expanded}>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {/* Auth Status */}
              <Box>
                <Typography variant="caption" sx={{ color: '#DC143C', fontWeight: 'bold' }}>
                  Authentication Status
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  <Chip
                    label={isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                    size="small"
                    color={isAuthenticated ? 'success' : 'error'}
                  />
                  <Chip
                    label={isLoading ? 'Loading' : 'Ready'}
                    size="small"
                    color={isLoading ? 'warning' : 'info'}
                  />
                  {isDemoMode && (
                    <Chip
                      label="Demo Mode"
                      size="small"
                      sx={{ backgroundColor: '#FF9800', color: 'white' }}
                    />
                  )}
                </Stack>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

              {/* User Info */}
              {user && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#DC143C', fontWeight: 'bold' }}>
                    User Information
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    Name: {user.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    Email: {user.email}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    Role: {user.role}
                  </Typography>
                  {user.company && (
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                      Company: {user.company}
                    </Typography>
                  )}
                </Box>
              )}

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

              {/* Session Info */}
              <Box>
                <Typography variant="caption" sx={{ color: '#DC143C', fontWeight: 'bold' }}>
                  Session Information
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  Valid: {sessionInfo.isValid ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  Needs Refresh: {sessionInfo.needsRefresh ? 'Yes' : 'No'}
                </Typography>
                {sessionInfo.expiresAt && (
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    Expires: {sessionInfo.expiresAt.toLocaleString()}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

              {/* Token Info */}
              <Box>
                <Typography variant="caption" sx={{ color: '#DC143C', fontWeight: 'bold' }}>
                  Token Information
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  Access Token: {token ? 'Present' : 'Missing'}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  Refresh Token: {refreshToken ? 'Present' : 'Missing'}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  Token Expired: {TokenService.isTokenExpired() ? 'Yes' : 'No'}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

              {/* Current URL */}
              <Box>
                <Typography variant="caption" sx={{ color: '#DC143C', fontWeight: 'bold' }}>
                  Current Location
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
                  {window.location.pathname}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

              {/* Actions */}
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleRefreshSession}
                  sx={{
                    borderColor: '#DC143C',
                    color: '#DC143C',
                    '&:hover': {
                      borderColor: '#B91C3C',
                      backgroundColor: 'rgba(220, 20, 60, 0.1)'
                    }
                  }}
                >
                  Refresh
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Delete />}
                  onClick={handleClearTokens}
                  sx={{
                    borderColor: '#f44336',
                    color: '#f44336',
                    '&:hover': {
                      borderColor: '#d32f2f',
                      backgroundColor: 'rgba(244, 67, 54, 0.1)'
                    }
                  }}
                >
                  Clear
                </Button>
              </Stack>

              {/* Warnings */}
              {!isAuthenticated && (
                <Alert severity="warning" sx={{ fontSize: '0.75rem' }}>
                  User is not authenticated. Check token validity.
                </Alert>
              )}

              {sessionInfo.needsRefresh && (
                <Alert severity="info" sx={{ fontSize: '0.75rem' }}>
                  Session needs refresh. Consider refreshing tokens.
                </Alert>
              )}

              {TokenService.isTokenExpired() && (
                <Alert severity="error" sx={{ fontSize: '0.75rem' }}>
                  Access token has expired. Refresh required.
                </Alert>
              )}
            </Stack>
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  )
}

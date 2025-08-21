import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Alert,
  LinearProgress,
  Stack,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Schedule,
  Refresh,
  ExitToApp,
  Security,
  Warning,
  CheckCircle,
  Info
} from '@mui/icons-material'
import { SessionService, TokenService } from '../../services/tokenService'
import { useAuth } from '../../contexts/AuthContext'

interface SessionInfoProps {
  compact?: boolean
  showActions?: boolean
}

export default function SessionInfo({ compact = false, showActions = true }: SessionInfoProps) {
  const { logout, isDemoMode } = useAuth()
  const [sessionInfo, setSessionInfo] = useState(SessionService.getSessionInfo())
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    const updateSessionInfo = () => {
      const info = SessionService.getSessionInfo()
      setSessionInfo(info)

      if (info.timeUntilExpiry && info.timeUntilExpiry > 0) {
        const minutes = Math.floor(info.timeUntilExpiry / (1000 * 60))
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60

        if (hours > 0) {
          setTimeLeft(`${hours}h ${remainingMinutes}m`)
        } else {
          setTimeLeft(`${remainingMinutes}m`)
        }
      } else {
        setTimeLeft('Expired')
      }
    }

    updateSessionInfo()

    // Update every minute
    const interval = setInterval(updateSessionInfo, 60000)

    return () => clearInterval(interval)
  }, [])

  const handleRefreshToken = async () => {
    try {
      await SessionService.refreshToken()
      setSessionInfo(SessionService.getSessionInfo())
    } catch (error) {
      console.error('Failed to refresh token:', error)
    }
  }

  const getStatusColor = () => {
    if (isDemoMode) return 'info'
    if (!sessionInfo.isValid) return 'error'
    if (sessionInfo.needsRefresh) return 'warning'
    return 'success'
  }

  const getStatusIcon = () => {
    if (isDemoMode) return <Info />
    if (!sessionInfo.isValid) return <Warning />
    if (sessionInfo.needsRefresh) return <Schedule />
    return <CheckCircle />
  }

  const getStatusText = () => {
    if (isDemoMode) return 'Demo Mode'
    if (!sessionInfo.isValid) return 'Session Expired'
    if (sessionInfo.needsRefresh) return 'Refresh Needed'
    return 'Active'
  }

  const getProgressValue = () => {
    if (!sessionInfo.timeUntilExpiry || sessionInfo.timeUntilExpiry <= 0) return 0
    
    // Assume 8 hours (28800000 ms) as full session time
    const fullSessionTime = 8 * 60 * 60 * 1000
    return Math.max(0, Math.min(100, (sessionInfo.timeUntilExpiry / fullSessionTime) * 100))
  }

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          icon={getStatusIcon()}
          label={getStatusText()}
          color={getStatusColor()}
          size="small"
          variant="outlined"
        />
        {!isDemoMode && sessionInfo.isValid && (
          <Typography variant="caption" color="text.secondary">
            {timeLeft}
          </Typography>
        )}
        {showActions && sessionInfo.needsRefresh && (
          <Tooltip title="Refresh Session">
            <IconButton size="small" onClick={handleRefreshToken}>
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    )
  }

  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security />
            Session Status
          </Typography>
          <Chip
            icon={getStatusIcon()}
            label={getStatusText()}
            color={getStatusColor()}
            variant="outlined"
          />
        </Box>

        {isDemoMode ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              You are currently in demo mode. No real authentication is active.
            </Typography>
          </Alert>
        ) : (
          <>
            {!sessionInfo.isValid && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Your session has expired. Please log in again.
                </Typography>
              </Alert>
            )}

            {sessionInfo.needsRefresh && sessionInfo.isValid && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Your session will expire soon. Consider refreshing your session.
                </Typography>
              </Alert>
            )}

            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Time Remaining
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={getProgressValue()}
                    sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                    color={sessionInfo.needsRefresh ? 'warning' : 'primary'}
                  />
                  <Typography variant="body2" sx={{ minWidth: 60 }}>
                    {timeLeft}
                  </Typography>
                </Box>
              </Box>

              {sessionInfo.expiresAt && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Expires At
                  </Typography>
                  <Typography variant="body2">
                    {sessionInfo.expiresAt.toLocaleString()}
                  </Typography>
                </Box>
              )}

              <Divider />

              {showActions && (
                <Stack direction="row" spacing={1}>
                  {sessionInfo.isValid && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Refresh />}
                      onClick={handleRefreshToken}
                      disabled={isDemoMode}
                    >
                      Refresh Session
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ExitToApp />}
                    onClick={logout}
                    color="error"
                  >
                    Logout
                  </Button>
                </Stack>
              )}
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Hook for session monitoring
export const useSessionMonitor = () => {
  const [sessionInfo, setSessionInfo] = useState(SessionService.getSessionInfo())

  useEffect(() => {
    const updateSessionInfo = () => {
      setSessionInfo(SessionService.getSessionInfo())
    }

    updateSessionInfo()
    const interval = setInterval(updateSessionInfo, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return {
    sessionInfo,
    isExpired: !sessionInfo.isValid,
    needsRefresh: sessionInfo.needsRefresh,
    timeUntilExpiry: sessionInfo.timeUntilExpiry,
    expiresAt: sessionInfo.expiresAt
  }
}

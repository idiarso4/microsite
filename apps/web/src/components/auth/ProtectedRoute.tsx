import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'
import { UserRole, Permission } from '../../types/auth'
import { usePermissions } from '../../hooks/usePermissions'
import { AuthLoadingScreen } from '../common/LoadingScreen'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  requireAllPermissions?: boolean
  module?: string
  action?: 'create' | 'read' | 'update' | 'delete'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  requiredPermissions,
  requireAllPermissions = false,
  module,
  action
}) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const {
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    canAccessModule,
    canPerformAction
  } = usePermissions()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <AuthLoadingScreen message="Verifying your access..." />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access if required
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
        textAlign="center"
        p={4}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You don't have permission to access this page.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Required role: {requiredRole}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your role: {user?.role}
        </Typography>
      </Box>
    )
  }

  // Check single permission
  if (requiredPermission && !checkPermission(requiredPermission)) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
        textAlign="center"
        p={4}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Permission Required
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You don't have the required permission to access this page.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Required permission: {requiredPermission}
        </Typography>
      </Box>
    )
  }

  // Check multiple permissions
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAccess = requireAllPermissions
      ? checkAllPermissions(requiredPermissions)
      : checkAnyPermission(requiredPermissions)

    if (!hasAccess) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          gap={2}
          textAlign="center"
          p={4}
        >
          <Typography variant="h4" color="error" gutterBottom>
            Multiple Permissions Required
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You don't have the required permissions to access this page.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Required: {requireAllPermissions ? 'All' : 'Any'} of {requiredPermissions.join(', ')}
          </Typography>
        </Box>
      )
    }
  }

  // Check module access
  if (module && !canAccessModule(module)) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
        textAlign="center"
        p={4}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Module Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You don't have access to the {module} module.
        </Typography>
      </Box>
    )
  }

  // Check module action permission
  if (module && action && !canPerformAction(module, action)) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
        textAlign="center"
        p={4}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Action Not Permitted
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You don't have permission to {action} in the {module} module.
        </Typography>
      </Box>
    )
  }

  // Render protected content
  return <>{children}</>
}

export default ProtectedRoute

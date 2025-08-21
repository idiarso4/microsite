import React from 'react'
import { Box, Typography, Alert, Button } from '@mui/material'
import { Lock, Warning } from '@mui/icons-material'
import { Permission, UserRole } from '../../types/auth'
import { usePermissions } from '../../hooks/usePermissions'

interface PermissionGuardProps {
  children: React.ReactNode
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  role?: UserRole
  module?: string
  action?: 'create' | 'read' | 'update' | 'delete'
  fallback?: React.ReactNode
  showFallback?: boolean
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  permissions,
  requireAll = false,
  role,
  module,
  action,
  fallback,
  showFallback = true
}) => {
  const {
    userRole,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    canAccessModule,
    canPerformAction
  } = usePermissions()

  // Check if user has required role
  if (role && userRole !== role) {
    return showFallback ? (
      fallback || (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            textAlign: 'center',
            minHeight: 200
          }}
        >
          <Lock sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Access Restricted
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This feature requires {role} role
          </Typography>
        </Box>
      )
    ) : null
  }

  // Check module access
  if (module && !canAccessModule(module)) {
    return showFallback ? (
      fallback || (
        <Alert 
          severity="warning" 
          icon={<Warning />}
          sx={{ m: 2 }}
        >
          <Typography variant="body2">
            You don't have permission to access the {module} module.
          </Typography>
        </Alert>
      )
    ) : null
  }

  // Check module action permission
  if (module && action && !canPerformAction(module, action)) {
    return showFallback ? (
      fallback || (
        <Alert 
          severity="info" 
          icon={<Lock />}
          sx={{ m: 2 }}
        >
          <Typography variant="body2">
            You don't have permission to {action} in the {module} module.
          </Typography>
        </Alert>
      )
    ) : null
  }

  // Check single permission
  if (permission && !checkPermission(permission)) {
    return showFallback ? (
      fallback || (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            textAlign: 'center',
            bgcolor: 'grey.50',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Lock sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
          <Typography variant="subtitle2" color="text.secondary">
            Permission Required
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {permission}
          </Typography>
        </Box>
      )
    ) : null
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    const hasAccess = requireAll 
      ? checkAllPermissions(permissions)
      : checkAnyPermission(permissions)

    if (!hasAccess) {
      return showFallback ? (
        fallback || (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
              textAlign: 'center',
              bgcolor: 'grey.50',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <Lock sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Multiple Permissions Required
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {requireAll ? 'All' : 'Any'} of: {permissions.join(', ')}
            </Typography>
          </Box>
        )
      ) : null
    }
  }

  // If all checks pass, render children
  return <>{children}</>
}

export default PermissionGuard

// Convenience components for common use cases
export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGuard role={UserRole.ADMIN} fallback={fallback}>
    {children}
  </PermissionGuard>
)

export const ManagerOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGuard 
    permissions={[Permission.USER_MANAGE_ROLES]} 
    fallback={fallback}
  >
    {children}
  </PermissionGuard>
)

export const CreatePermission: React.FC<{ 
  module: string
  children: React.ReactNode
  fallback?: React.ReactNode 
}> = ({ module, children, fallback }) => (
  <PermissionGuard module={module} action="create" fallback={fallback}>
    {children}
  </PermissionGuard>
)

export const UpdatePermission: React.FC<{ 
  module: string
  children: React.ReactNode
  fallback?: React.ReactNode 
}> = ({ module, children, fallback }) => (
  <PermissionGuard module={module} action="update" fallback={fallback}>
    {children}
  </PermissionGuard>
)

export const DeletePermission: React.FC<{ 
  module: string
  children: React.ReactNode
  fallback?: React.ReactNode 
}> = ({ module, children, fallback }) => (
  <PermissionGuard module={module} action="delete" fallback={fallback}>
    {children}
  </PermissionGuard>
)

export const ReportsPermission: React.FC<{ 
  children: React.ReactNode
  fallback?: React.ReactNode 
}> = ({ children, fallback }) => (
  <PermissionGuard permission={Permission.REPORTS_READ} fallback={fallback}>
    {children}
  </PermissionGuard>
)

export const SettingsPermission: React.FC<{ 
  children: React.ReactNode
  fallback?: React.ReactNode 
}> = ({ children, fallback }) => (
  <PermissionGuard permission={Permission.SETTINGS_READ} fallback={fallback}>
    {children}
  </PermissionGuard>
)

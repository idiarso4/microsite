import { useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  UserRole, 
  Permission, 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  ROLE_PERMISSIONS 
} from '../types/auth'

export const usePermissions = () => {
  const { user } = useAuth()

  const userRole = useMemo(() => {
    if (!user?.role) return null
    return user.role as UserRole
  }, [user?.role])

  const userPermissions = useMemo(() => {
    if (!userRole) return []
    return ROLE_PERMISSIONS[userRole] || []
  }, [userRole])

  const checkPermission = (permission: Permission): boolean => {
    if (!userRole) return false
    return hasPermission(userRole, permission)
  }

  const checkAnyPermission = (permissions: Permission[]): boolean => {
    if (!userRole) return false
    return hasAnyPermission(userRole, permissions)
  }

  const checkAllPermissions = (permissions: Permission[]): boolean => {
    if (!userRole) return false
    return hasAllPermissions(userRole, permissions)
  }

  const canAccessModule = (module: string): boolean => {
    if (!userRole) return false
    
    const modulePermissions: Record<string, Permission[]> = {
      accounting: [Permission.ACCOUNTING_READ],
      inventory: [Permission.INVENTORY_READ],
      crm: [Permission.CRM_READ],
      hr: [Permission.HR_READ],
      manufacturing: [Permission.MANUFACTURING_READ],
      procurement: [Permission.PROCUREMENT_READ],
      analytics: [Permission.ANALYTICS_READ],
      reports: [Permission.REPORTS_READ],
      settings: [Permission.SETTINGS_READ],
      users: [Permission.USER_READ]
    }

    const requiredPermissions = modulePermissions[module.toLowerCase()]
    if (!requiredPermissions) return false

    return checkAnyPermission(requiredPermissions)
  }

  const canPerformAction = (module: string, action: 'create' | 'read' | 'update' | 'delete'): boolean => {
    if (!userRole) return false

    const actionPermissions: Record<string, Record<string, Permission>> = {
      accounting: {
        create: Permission.ACCOUNTING_CREATE,
        read: Permission.ACCOUNTING_READ,
        update: Permission.ACCOUNTING_UPDATE,
        delete: Permission.ACCOUNTING_DELETE
      },
      inventory: {
        create: Permission.INVENTORY_CREATE,
        read: Permission.INVENTORY_READ,
        update: Permission.INVENTORY_UPDATE,
        delete: Permission.INVENTORY_DELETE
      },
      crm: {
        create: Permission.CRM_CREATE,
        read: Permission.CRM_READ,
        update: Permission.CRM_UPDATE,
        delete: Permission.CRM_DELETE
      },
      hr: {
        create: Permission.HR_CREATE,
        read: Permission.HR_READ,
        update: Permission.HR_UPDATE,
        delete: Permission.HR_DELETE
      },
      manufacturing: {
        create: Permission.MANUFACTURING_CREATE,
        read: Permission.MANUFACTURING_READ,
        update: Permission.MANUFACTURING_UPDATE,
        delete: Permission.MANUFACTURING_DELETE
      },
      procurement: {
        create: Permission.PROCUREMENT_CREATE,
        read: Permission.PROCUREMENT_READ,
        update: Permission.PROCUREMENT_UPDATE,
        delete: Permission.PROCUREMENT_DELETE
      },
      user: {
        create: Permission.USER_CREATE,
        read: Permission.USER_READ,
        update: Permission.USER_UPDATE,
        delete: Permission.USER_DELETE
      }
    }

    const permission = actionPermissions[module.toLowerCase()]?.[action]
    if (!permission) return false

    return checkPermission(permission)
  }

  const isAdmin = (): boolean => {
    return userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN
  }

  const isSuperAdmin = (): boolean => {
    return userRole === UserRole.SUPER_ADMIN
  }

  const isManager = (): boolean => {
    return userRole === UserRole.MANAGER || isAdmin()
  }

  const canManageUsers = (): boolean => {
    return checkPermission(Permission.USER_MANAGE_ROLES)
  }

  const canAccessSettings = (): boolean => {
    return checkPermission(Permission.SETTINGS_READ)
  }

  const canModifySettings = (): boolean => {
    return checkPermission(Permission.SETTINGS_UPDATE)
  }

  const canAccessSystemSettings = (): boolean => {
    return checkPermission(Permission.SETTINGS_SYSTEM)
  }

  const canViewReports = (): boolean => {
    return checkPermission(Permission.REPORTS_READ)
  }

  const canCreateReports = (): boolean => {
    return checkPermission(Permission.REPORTS_CREATE)
  }

  const canExportReports = (): boolean => {
    return checkPermission(Permission.REPORTS_EXPORT)
  }

  const canViewAnalytics = (): boolean => {
    return checkPermission(Permission.ANALYTICS_READ)
  }

  const canViewAdvancedAnalytics = (): boolean => {
    return checkPermission(Permission.ANALYTICS_ADVANCED)
  }

  const getAccessibleModules = (): string[] => {
    const modules = [
      'accounting',
      'inventory', 
      'crm',
      'hr',
      'manufacturing',
      'procurement',
      'analytics',
      'reports'
    ]

    return modules.filter(module => canAccessModule(module))
  }

  const getModuleActions = (module: string): string[] => {
    const actions = ['create', 'read', 'update', 'delete'] as const
    return actions.filter(action => canPerformAction(module, action))
  }

  return {
    userRole,
    userPermissions,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    canAccessModule,
    canPerformAction,
    isAdmin,
    isSuperAdmin,
    isManager,
    canManageUsers,
    canAccessSettings,
    canModifySettings,
    canAccessSystemSettings,
    canViewReports,
    canCreateReports,
    canExportReports,
    canViewAnalytics,
    canViewAdvancedAnalytics,
    getAccessibleModules,
    getModuleActions
  }
}

export default usePermissions

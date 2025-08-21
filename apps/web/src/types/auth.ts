// User roles in the system
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  VIEWER = 'viewer'
}

// Permissions for different actions
export enum Permission {
  // User Management
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_MANAGE_ROLES = 'user:manage_roles',

  // Company/Tenant Management
  COMPANY_CREATE = 'company:create',
  COMPANY_READ = 'company:read',
  COMPANY_UPDATE = 'company:update',
  COMPANY_DELETE = 'company:delete',
  COMPANY_SETTINGS = 'company:settings',

  // Accounting Module
  ACCOUNTING_READ = 'accounting:read',
  ACCOUNTING_CREATE = 'accounting:create',
  ACCOUNTING_UPDATE = 'accounting:update',
  ACCOUNTING_DELETE = 'accounting:delete',
  ACCOUNTING_REPORTS = 'accounting:reports',
  ACCOUNTING_APPROVE = 'accounting:approve',

  // Inventory Module
  INVENTORY_READ = 'inventory:read',
  INVENTORY_CREATE = 'inventory:create',
  INVENTORY_UPDATE = 'inventory:update',
  INVENTORY_DELETE = 'inventory:delete',
  INVENTORY_REPORTS = 'inventory:reports',
  INVENTORY_ADJUST = 'inventory:adjust',

  // CRM Module
  CRM_READ = 'crm:read',
  CRM_CREATE = 'crm:create',
  CRM_UPDATE = 'crm:update',
  CRM_DELETE = 'crm:delete',
  CRM_REPORTS = 'crm:reports',
  CRM_MANAGE_PIPELINE = 'crm:manage_pipeline',

  // HR Module
  HR_READ = 'hr:read',
  HR_CREATE = 'hr:create',
  HR_UPDATE = 'hr:update',
  HR_DELETE = 'hr:delete',
  HR_REPORTS = 'hr:reports',
  HR_PAYROLL = 'hr:payroll',

  // Manufacturing Module
  MANUFACTURING_READ = 'manufacturing:read',
  MANUFACTURING_CREATE = 'manufacturing:create',
  MANUFACTURING_UPDATE = 'manufacturing:update',
  MANUFACTURING_DELETE = 'manufacturing:delete',
  MANUFACTURING_REPORTS = 'manufacturing:reports',
  MANUFACTURING_CONTROL = 'manufacturing:control',

  // Procurement Module
  PROCUREMENT_READ = 'procurement:read',
  PROCUREMENT_CREATE = 'procurement:create',
  PROCUREMENT_UPDATE = 'procurement:update',
  PROCUREMENT_DELETE = 'procurement:delete',
  PROCUREMENT_REPORTS = 'procurement:reports',
  PROCUREMENT_APPROVE = 'procurement:approve',

  // Analytics & Reports
  ANALYTICS_READ = 'analytics:read',
  ANALYTICS_ADVANCED = 'analytics:advanced',
  REPORTS_READ = 'reports:read',
  REPORTS_CREATE = 'reports:create',
  REPORTS_EXPORT = 'reports:export',

  // System Settings
  SETTINGS_READ = 'settings:read',
  SETTINGS_UPDATE = 'settings:update',
  SETTINGS_SYSTEM = 'settings:system',
  SETTINGS_SECURITY = 'settings:security'
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    // All permissions
    ...Object.values(Permission)
  ],

  [UserRole.ADMIN]: [
    // User Management (except super admin functions)
    Permission.USER_CREATE,
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_MANAGE_ROLES,

    // Company Management
    Permission.COMPANY_READ,
    Permission.COMPANY_UPDATE,
    Permission.COMPANY_SETTINGS,

    // All module permissions
    Permission.ACCOUNTING_READ,
    Permission.ACCOUNTING_CREATE,
    Permission.ACCOUNTING_UPDATE,
    Permission.ACCOUNTING_DELETE,
    Permission.ACCOUNTING_REPORTS,
    Permission.ACCOUNTING_APPROVE,

    Permission.INVENTORY_READ,
    Permission.INVENTORY_CREATE,
    Permission.INVENTORY_UPDATE,
    Permission.INVENTORY_DELETE,
    Permission.INVENTORY_REPORTS,
    Permission.INVENTORY_ADJUST,

    Permission.CRM_READ,
    Permission.CRM_CREATE,
    Permission.CRM_UPDATE,
    Permission.CRM_DELETE,
    Permission.CRM_REPORTS,
    Permission.CRM_MANAGE_PIPELINE,

    Permission.HR_READ,
    Permission.HR_CREATE,
    Permission.HR_UPDATE,
    Permission.HR_DELETE,
    Permission.HR_REPORTS,
    Permission.HR_PAYROLL,

    Permission.MANUFACTURING_READ,
    Permission.MANUFACTURING_CREATE,
    Permission.MANUFACTURING_UPDATE,
    Permission.MANUFACTURING_DELETE,
    Permission.MANUFACTURING_REPORTS,
    Permission.MANUFACTURING_CONTROL,

    Permission.PROCUREMENT_READ,
    Permission.PROCUREMENT_CREATE,
    Permission.PROCUREMENT_UPDATE,
    Permission.PROCUREMENT_DELETE,
    Permission.PROCUREMENT_REPORTS,
    Permission.PROCUREMENT_APPROVE,

    // Analytics & Reports
    Permission.ANALYTICS_READ,
    Permission.ANALYTICS_ADVANCED,
    Permission.REPORTS_READ,
    Permission.REPORTS_CREATE,
    Permission.REPORTS_EXPORT,

    // Settings
    Permission.SETTINGS_READ,
    Permission.SETTINGS_UPDATE,
    Permission.SETTINGS_SECURITY
  ],

  [UserRole.MANAGER]: [
    // Limited user management
    Permission.USER_READ,
    Permission.USER_UPDATE,

    // Company read access
    Permission.COMPANY_READ,

    // Module permissions (no delete for critical data)
    Permission.ACCOUNTING_READ,
    Permission.ACCOUNTING_CREATE,
    Permission.ACCOUNTING_UPDATE,
    Permission.ACCOUNTING_REPORTS,

    Permission.INVENTORY_READ,
    Permission.INVENTORY_CREATE,
    Permission.INVENTORY_UPDATE,
    Permission.INVENTORY_REPORTS,
    Permission.INVENTORY_ADJUST,

    Permission.CRM_READ,
    Permission.CRM_CREATE,
    Permission.CRM_UPDATE,
    Permission.CRM_REPORTS,
    Permission.CRM_MANAGE_PIPELINE,

    Permission.HR_READ,
    Permission.HR_CREATE,
    Permission.HR_UPDATE,
    Permission.HR_REPORTS,

    Permission.MANUFACTURING_READ,
    Permission.MANUFACTURING_CREATE,
    Permission.MANUFACTURING_UPDATE,
    Permission.MANUFACTURING_REPORTS,

    Permission.PROCUREMENT_READ,
    Permission.PROCUREMENT_CREATE,
    Permission.PROCUREMENT_UPDATE,
    Permission.PROCUREMENT_REPORTS,

    // Analytics & Reports
    Permission.ANALYTICS_READ,
    Permission.REPORTS_READ,
    Permission.REPORTS_CREATE,
    Permission.REPORTS_EXPORT,

    // Settings (read only)
    Permission.SETTINGS_READ
  ],

  [UserRole.EMPLOYEE]: [
    // Basic user access
    Permission.USER_READ,

    // Company read access
    Permission.COMPANY_READ,

    // Limited module access
    Permission.ACCOUNTING_READ,
    Permission.ACCOUNTING_CREATE,

    Permission.INVENTORY_READ,
    Permission.INVENTORY_CREATE,
    Permission.INVENTORY_UPDATE,

    Permission.CRM_READ,
    Permission.CRM_CREATE,
    Permission.CRM_UPDATE,

    Permission.HR_READ,

    Permission.MANUFACTURING_READ,
    Permission.MANUFACTURING_CREATE,

    Permission.PROCUREMENT_READ,
    Permission.PROCUREMENT_CREATE,

    // Basic analytics
    Permission.ANALYTICS_READ,
    Permission.REPORTS_READ,

    // Settings (read only)
    Permission.SETTINGS_READ
  ],

  [UserRole.VIEWER]: [
    // Read-only access
    Permission.USER_READ,
    Permission.COMPANY_READ,
    Permission.ACCOUNTING_READ,
    Permission.INVENTORY_READ,
    Permission.CRM_READ,
    Permission.HR_READ,
    Permission.MANUFACTURING_READ,
    Permission.PROCUREMENT_READ,
    Permission.ANALYTICS_READ,
    Permission.REPORTS_READ,
    Permission.SETTINGS_READ
  ]
}

// Helper functions
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
}

export const hasAnyPermission = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission))
}

export const hasAllPermissions = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission))
}

export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames = {
    [UserRole.SUPER_ADMIN]: 'Super Administrator',
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.MANAGER]: 'Manager',
    [UserRole.EMPLOYEE]: 'Employee',
    [UserRole.VIEWER]: 'Viewer'
  }
  return roleNames[role] || role
}

export const getRoleDescription = (role: UserRole): string => {
  const descriptions = {
    [UserRole.SUPER_ADMIN]: 'Full system access with all permissions',
    [UserRole.ADMIN]: 'Administrative access to manage users and all modules',
    [UserRole.MANAGER]: 'Management access with approval and reporting capabilities',
    [UserRole.EMPLOYEE]: 'Standard access for daily operations',
    [UserRole.VIEWER]: 'Read-only access to view data and reports'
  }
  return descriptions[role] || 'No description available'
}

export const getRoleColor = (role: UserRole): string => {
  const colors = {
    [UserRole.SUPER_ADMIN]: '#9C27B0', // Purple
    [UserRole.ADMIN]: '#F44336',       // Red
    [UserRole.MANAGER]: '#FF9800',     // Orange
    [UserRole.EMPLOYEE]: '#2196F3',    // Blue
    [UserRole.VIEWER]: '#4CAF50'       // Green
  }
  return colors[role] || '#757575'
}

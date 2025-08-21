import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Stack,
  Avatar,
  Tooltip
} from '@mui/material'
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  PersonAdd,
  Security,
  Block,
  CheckCircle
} from '@mui/icons-material'
import { UserRole, getRoleDisplayName, getRoleColor, getRoleDescription } from '../../types/auth'
import { usePermissions } from '../../hooks/usePermissions'
import PermissionGuard from '../auth/PermissionGuard'

interface User {
  id: number
  name: string
  email: string
  role: UserRole
  company?: string
  isActive: boolean
  lastLogin?: string
  createdAt: string
}

const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@company.com',
    role: UserRole.ADMIN,
    company: 'Tech Corp',
    isActive: true,
    lastLogin: '2024-01-15 10:30:00',
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@company.com',
    role: UserRole.MANAGER,
    company: 'Tech Corp',
    isActive: true,
    lastLogin: '2024-01-14 15:45:00',
    createdAt: '2024-01-02'
  },
  {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob@company.com',
    role: UserRole.EMPLOYEE,
    company: 'Tech Corp',
    isActive: false,
    lastLogin: '2024-01-10 09:15:00',
    createdAt: '2024-01-03'
  }
]

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.EMPLOYEE,
    company: ''
  })

  const { canManageUsers, isAdmin } = usePermissions()

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedUser(null)
  }

  const handleCreateUser = () => {
    setDialogMode('create')
    setFormData({
      name: '',
      email: '',
      role: UserRole.EMPLOYEE,
      company: ''
    })
    setOpenDialog(true)
  }

  const handleEditUser = () => {
    if (selectedUser) {
      setDialogMode('edit')
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        company: selectedUser.company || ''
      })
      setOpenDialog(true)
    }
    handleMenuClose()
  }

  const handleToggleUserStatus = () => {
    if (selectedUser) {
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, isActive: !user.isActive }
          : user
      ))
    }
    handleMenuClose()
  }

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id))
    }
    handleMenuClose()
  }

  const handleSaveUser = () => {
    if (dialogMode === 'create') {
      const newUser: User = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setUsers([...users, newUser])
    } else if (selectedUser) {
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...formData }
          : user
      ))
    }
    setOpenDialog(false)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <PermissionGuard 
      permissions={[]} 
      fallback={
        <Alert severity="error">
          You don't have permission to access user management.
        </Alert>
      }
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            User Management
          </Typography>
          
          <PermissionGuard permissions={[]} showFallback={false}>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={handleCreateUser}
              sx={{
                background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                }
              }}
            >
              Add User
            </Button>
          </PermissionGuard>
        </Box>

        <Card>
          <CardContent>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: getRoleColor(user.role),
                              width: 40,
                              height: 40
                            }}
                          >
                            {getInitials(user.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {user.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={getRoleDescription(user.role)}>
                          <Chip
                            label={getRoleDisplayName(user.role)}
                            size="small"
                            sx={{
                              backgroundColor: getRoleColor(user.role),
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.company || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={user.isActive ? <CheckCircle /> : <Block />}
                          label={user.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={user.isActive ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, user)}
                          size="small"
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditUser}>
            <Edit sx={{ mr: 1 }} />
            Edit User
          </MenuItem>
          <MenuItem onClick={handleToggleUserStatus}>
            {selectedUser?.isActive ? <Block sx={{ mr: 1 }} /> : <CheckCircle sx={{ mr: 1 }} />}
            {selectedUser?.isActive ? 'Deactivate' : 'Activate'}
          </MenuItem>
          <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} />
            Delete User
          </MenuItem>
        </Menu>

        {/* Create/Edit User Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {dialogMode === 'create' ? 'Add New User' : 'Edit User'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                fullWidth
                label="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                >
                  {Object.values(UserRole).map((role) => (
                    <MenuItem key={role} value={role}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: getRoleColor(role)
                          }}
                        />
                        {getRoleDisplayName(role)}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveUser}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                }
              }}
            >
              {dialogMode === 'create' ? 'Create User' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PermissionGuard>
  )
}

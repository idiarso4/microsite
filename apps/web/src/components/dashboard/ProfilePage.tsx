import { useState } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material'
import {
  Person,
  Email,
  Phone,
  Business,
  LocationOn,
  CalendarToday,
  Edit,
  Save,
  Cancel,
  Security,
  Notifications,
  History,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false)
  const [passwordDialog, setPasswordDialog] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@microsite.com',
    phone: '+62 812-3456-7890',
    company: 'MicroSite ERP Solutions',
    position: 'System Administrator',
    address: 'Jl. Sudirman No. 123, Jakarta',
    joinDate: '2024-01-15',
    lastLogin: '2024-08-21 14:30:00',
    avatar: ''
  })

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const handleSaveProfile = () => {
    // Simulate API call
    setTimeout(() => {
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' })
      setEditMode(false)
    }, 1000)
  }

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      setSnackbar({ open: true, message: 'New passwords do not match!', severity: 'error' })
      return
    }
    
    // Simulate API call
    setTimeout(() => {
      setSnackbar({ open: true, message: 'Password changed successfully!', severity: 'success' })
      setPasswordDialog(false)
      setPasswords({ current: '', new: '', confirm: '' })
    }, 1000)
  }

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const recentActivities = [
    { action: 'Logged in', time: '2024-08-21 14:30:00', type: 'login' },
    { action: 'Updated inventory', time: '2024-08-21 13:45:00', type: 'update' },
    { action: 'Created new order', time: '2024-08-21 12:20:00', type: 'create' },
    { action: 'Generated report', time: '2024-08-21 11:15:00', type: 'report' },
    { action: 'Updated profile', time: '2024-08-20 16:30:00', type: 'update' }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return '🔐'
      case 'update': return '✏️'
      case 'create': return '➕'
      case 'report': return '📊'
      default: return '📝'
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
            My Profile 👤
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your personal information and account settings
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Personal Information
                </Typography>
                <Button
                  variant={editMode ? "contained" : "outlined"}
                  startIcon={editMode ? <Save /> : <Edit />}
                  onClick={editMode ? handleSaveProfile : () => setEditMode(true)}
                  sx={{
                    borderColor: '#DC143C',
                    color: editMode ? 'white' : '#DC143C',
                    backgroundColor: editMode ? '#DC143C' : 'transparent',
                    '&:hover': {
                      borderColor: '#B91C3C',
                      backgroundColor: editMode ? '#B91C3C' : 'rgba(220, 20, 60, 0.04)'
                    }
                  }}
                >
                  {editMode ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        mb: 2,
                        backgroundColor: '#DC143C',
                        fontSize: '2rem'
                      }}
                      src={profile.avatar}
                    >
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    {editMode && (
                      <Button variant="outlined" size="small">
                        Change Photo
                      </Button>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={profile.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: <Person sx={{ mr: 1, color: '#DC143C' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={profile.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: <Email sx={{ mr: 1, color: '#DC143C' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={profile.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: '#DC143C' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Position"
                        value={profile.position}
                        onChange={(e) => handleProfileChange('position', e.target.value)}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: <Business sx={{ mr: 1, color: '#DC143C' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        value={profile.address}
                        onChange={(e) => handleProfileChange('address', e.target.value)}
                        disabled={!editMode}
                        multiline
                        rows={2}
                        InputProps={{
                          startAdornment: <LocationOn sx={{ mr: 1, color: '#DC143C' }} />
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {editMode && (
                <Box mt={3} display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => setEditMode(false)}
                    sx={{
                      borderColor: '#666',
                      color: '#666',
                      '&:hover': {
                        borderColor: '#444',
                        backgroundColor: 'rgba(0,0,0,0.04)'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Account Info & Actions */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Account Status */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Account Status
                  </Typography>
                  <List>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CalendarToday sx={{ color: '#4CAF50' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Member Since"
                        secondary={new Date(profile.joinDate).toLocaleDateString()}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <History sx={{ color: '#2196F3' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Last Login"
                        secondary={new Date(profile.lastLogin).toLocaleString()}
                      />
                    </ListItem>
                  </List>
                  <Chip 
                    label="Active" 
                    color="success" 
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Security Actions */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Security
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Security />}
                    onClick={() => setPasswordDialog(true)}
                    sx={{
                      borderColor: '#DC143C',
                      color: '#DC143C',
                      '&:hover': {
                        borderColor: '#B91C3C',
                        backgroundColor: 'rgba(220, 20, 60, 0.04)'
                      }
                    }}
                  >
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Recent Activity
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Box sx={{ fontSize: '1.5rem' }}>
                        {getActivityIcon(activity.type)}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.action}
                      secondary={new Date(activity.time).toLocaleString()}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type={showPassword ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwords.new}
                onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleChangePassword}
            variant="contained"
            sx={{
              backgroundColor: '#DC143C',
              '&:hover': { backgroundColor: '#B91C3C' }
            }}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

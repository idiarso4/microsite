import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Alert,
  Snackbar,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  MenuItem
} from '@mui/material'
import {
  Settings,
  Person,
  Security,
  Notifications,
  Business,
  Palette,
  Save,
  Edit,
  Delete
} from '@mui/icons-material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function SettingsPage() {
  const [tabValue, setTabValue] = useState(0)
  const [saving, setSaving] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  // Load settings from localStorage or use defaults
  const loadSettings = () => {
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      return JSON.parse(savedSettings)
    }
    return {
      profile: {
        name: 'Admin User',
        email: 'admin@microsite.com',
        phone: '+62 812-3456-7890',
        company: 'MicroSite ERP Solutions',
        position: 'System Administrator'
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        weeklyReports: true,
        monthlyReports: true
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90
      },
      appearance: {
        darkMode: false,
        language: 'id',
        timezone: 'Asia/Jakarta'
      },
      company: {
        name: 'MicroSite ERP Solutions',
        address: 'Jl. Sudirman No. 123, Jakarta',
        phone: '+62 21-1234567',
        email: 'info@microsite.com',
        website: 'https://microsite.com',
        taxId: '01.234.567.8-901.000'
      }
    }
  }

  const [settings, setSettings] = useState(loadSettings)

  // Load settings on component mount
  useEffect(() => {
    const savedSettings = loadSettings()
    setSettings(savedSettings)
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleSave = async (section: string) => {
    setSaving(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Save to localStorage
      localStorage.setItem('appSettings', JSON.stringify(settings))

      // Show success message
      setSnackbar({
        open: true,
        message: `${section} settings saved successfully!`,
        severity: 'success'
      })

      // Log for debugging
      console.log('Settings saved:', settings)
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to save ${section} settings!`,
        severity: 'error'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      localStorage.removeItem('appSettings')
      const defaultSettings = loadSettings()
      setSettings(defaultSettings)
      setSnackbar({
        open: true,
        message: 'Settings reset to default successfully!',
        severity: 'success'
      })
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
            Settings ⚙️
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Kelola pengaturan sistem dan preferensi akun
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="error"
          onClick={handleResetSettings}
          sx={{
            borderColor: '#f44336',
            color: '#f44336',
            '&:hover': {
              borderColor: '#d32f2f',
              backgroundColor: 'rgba(244, 67, 54, 0.04)'
            }
          }}
        >
          Reset to Default
        </Button>
      </Box>

      {/* Settings Tabs */}
      <Paper sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs">
            <Tab icon={<Person />} label="Profile" />
            <Tab icon={<Notifications />} label="Notifications" />
            <Tab icon={<Security />} label="Security" />
            <Tab icon={<Palette />} label="Appearance" />
            <Tab icon={<Business />} label="Company" />
            <Tab icon={<Settings />} label="System" />
          </Tabs>
        </Box>

        {/* Profile Settings */}
        <TabPanel value={tabValue} index={0}>
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
                >
                  {settings.profile.name.charAt(0)}
                </Avatar>
                <Button variant="outlined" size="small">
                  Change Photo
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={settings.profile.name}
                    onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={settings.profile.phone}
                    onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Position"
                    value={settings.profile.position}
                    onChange={(e) => handleSettingChange('profile', 'position', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company"
                    value={settings.profile.company}
                    onChange={(e) => handleSettingChange('profile', 'company', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                    onClick={() => handleSave('Profile')}
                    disabled={saving}
                    sx={{
                      background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                      }
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notifications Settings */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Notification Preferences
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive notifications via email"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Push Notifications"
                secondary="Receive browser push notifications"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="SMS Notifications"
                secondary="Receive notifications via SMS"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.notifications.smsNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Weekly Reports"
                secondary="Receive weekly business reports"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.notifications.weeklyReports}
                  onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Monthly Reports"
                secondary="Receive monthly business reports"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={settings.notifications.monthlyReports}
                  onChange={(e) => handleSettingChange('notifications', 'monthlyReports', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          <Box mt={3}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={() => handleSave('Notification')}
              sx={{
                background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                }
              }}
            >
              Save Notifications
            </Button>
          </Box>
        </TabPanel>

        {/* Security Settings */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Security Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                  />
                }
                label="Enable Two-Factor Authentication"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Session Timeout (minutes)"
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password Expiry (days)"
                type="number"
                value={settings.security.passwordExpiry}
                onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" sx={{ mr: 2 }}>
                Change Password
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSave('Security')}
                sx={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                  }
                }}
              >
                Save Security
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Appearance Settings */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Appearance Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.appearance.darkMode}
                    onChange={(e) => handleSettingChange('appearance', 'darkMode', e.target.checked)}
                  />
                }
                label="Dark Mode"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Language"
                value={settings.appearance.language}
                onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                inputProps={{
                  'aria-label': 'Language selection',
                  'title': 'Select application language'
                }}
              >
                <MenuItem value="id">Bahasa Indonesia</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Timezone"
                value={settings.appearance.timezone}
                onChange={(e) => handleSettingChange('appearance', 'timezone', e.target.value)}
                inputProps={{
                  'aria-label': 'Timezone selection',
                  'title': 'Select application timezone'
                }}
              >
                <MenuItem value="Asia/Jakarta">Asia/Jakarta</MenuItem>
                <MenuItem value="Asia/Singapore">Asia/Singapore</MenuItem>
                <MenuItem value="UTC">UTC</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSave('Appearance')}
                sx={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                  }
                }}
              >
                Save Appearance
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Company Settings */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Company Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={settings.company?.name || ''}
                onChange={(e) => handleSettingChange('company', 'name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tax ID"
                value={settings.company?.taxId || ''}
                onChange={(e) => handleSettingChange('company', 'taxId', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={settings.company?.address || ''}
                onChange={(e) => handleSettingChange('company', 'address', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Phone"
                value={settings.company?.phone || ''}
                onChange={(e) => handleSettingChange('company', 'phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Email"
                value={settings.company?.email || ''}
                onChange={(e) => handleSettingChange('company', 'email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Website"
                value={settings.company?.website || ''}
                onChange={(e) => handleSettingChange('company', 'website', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSave('Company')}
                sx={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                  }
                }}
              >
                Save Company Info
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* System Settings */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                System Configuration
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Regional Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Language"
                      value={settings.appearance.language}
                      onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                      inputProps={{
                        'aria-label': 'System language selection',
                        'title': 'Select system language'
                      }}
                    >
                      <MenuItem value="id">Bahasa Indonesia</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Timezone"
                      value={settings.appearance.timezone}
                      onChange={(e) => handleSettingChange('appearance', 'timezone', e.target.value)}
                      inputProps={{
                        'aria-label': 'System timezone selection',
                        'title': 'Select system timezone'
                      }}
                    >
                      <MenuItem value="Asia/Jakarta">Asia/Jakarta (WIB)</MenuItem>
                      <MenuItem value="Asia/Makassar">Asia/Makassar (WITA)</MenuItem>
                      <MenuItem value="Asia/Jayapura">Asia/Jayapura (WIT)</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Data & Backup
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Auto Backup"
                      secondary="Automatically backup data daily"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={true}
                        onChange={() => {}}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Export Data"
                      secondary="Download all system data"
                    />
                    <ListItemSecondaryAction>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleSave('Data Export')}
                        sx={{
                          borderColor: '#DC143C',
                          color: '#DC143C',
                          '&:hover': {
                            borderColor: '#B91C3C',
                            backgroundColor: 'rgba(220, 20, 60, 0.04)'
                          }
                        }}
                      >
                        Export
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  System Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">Version</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>v1.0.0</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">Last Update</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>2024-08-21</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">Database</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>PostgreSQL</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">Storage Used</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>2.4 GB</Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={() => handleSave('System')}
                sx={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                  }
                }}
              >
                Save System Settings
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

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

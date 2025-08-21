import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Stack,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab
} from '@mui/material'
import {
  Add,
  MoreVert,
  Phone,
  Email,
  TrendingUp,
  TrendingDown,
  People,
  Business,
  AttachMoney,
  Assignment,
  Edit,
  Delete,
  Print,
  Download,
  Search,
  Person,
  Schedule,
  Group,
  CallMade,
  CallReceived,
  Message,
  Event,
  Star,
  StarBorder,
  Visibility,
  FilterList
} from '@mui/icons-material'
import { apiService } from '../../services/api'
import LeadForm from '../forms/LeadForm'
import { LeadFormData } from '../../utils/validationSchemas'



const getStatusColor = (status: string) => {
  switch (status) {
    case 'hot': return '#f44336'
    case 'warm': return '#ff9800'
    case 'cold': return '#2196f3'
    default: return '#757575'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'hot': return 'Hot Lead'
    case 'warm': return 'Warm Lead'
    case 'cold': return 'Cold Lead'
    default: return 'Unknown'
  }
}

export default function CRMPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [leadsData, setLeadsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<any>(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentTab, setCurrentTab] = useState(0)
  const [contactDialog, setContactDialog] = useState(false)
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [activityDialog, setActivityDialog] = useState(false)
  const [pipelineView, setPipelineView] = useState(false)

  const fetchLeadsData = async () => {
    try {
      setLoading(true)
      const params: any = { limit: 10 }
      if (searchTerm) params.search = searchTerm
      if (statusFilter) params.status = statusFilter

      const data = await apiService.getLeads(params)
      setLeadsData(data)
      setError(null)
    } catch (err: any) {
      console.error('Failed to fetch leads data:', err)
      setError(err.message || 'Failed to load leads data')
      setSnackbar({
        open: true,
        message: `Error loading leads: ${err.message || 'Unknown error'}`,
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLeadsData()
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter])

  const handleCreateLead = async (data: LeadFormData) => {
    try {
      await apiService.createLead(data)
      setSnackbar({ open: true, message: 'Lead berhasil ditambahkan!', severity: 'success' })
      fetchLeadsData()
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Gagal menambahkan lead', severity: 'error' })
      throw error
    }
  }

  const handleUpdateLead = async (data: LeadFormData) => {
    try {
      await apiService.updateLead(editingLead.id, data)
      setSnackbar({ open: true, message: 'Lead berhasil diperbarui!', severity: 'success' })
      fetchLeadsData()
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Gagal memperbarui lead', severity: 'error' })
      throw error
    }
  }

  const handleDeleteLead = async (leadId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus lead ini?')) {
      try {
        await apiService.deleteLead(leadId)
        setSnackbar({ open: true, message: 'Lead berhasil dihapus!', severity: 'success' })
        fetchLeadsData()
      } catch (error: any) {
        setSnackbar({ open: true, message: error.message || 'Gagal menghapus lead', severity: 'error' })
      }
    }
  }

  const handleExportLeads = () => {
    window.open('http://localhost:3001/api/leads/export', '_blank')
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, lead: any) => {
    setAnchorEl(event.currentTarget)
    setSelectedLead(lead)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedLead(null)
  }

  const handleEdit = () => {
    setEditingLead(selectedLead)
    setFormOpen(true)
    handleMenuClose()
  }

  const handleDelete = () => {
    if (selectedLead) {
      handleDeleteLead(selectedLead.id)
    }
    handleMenuClose()
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: '#DC143C' }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please try refreshing the page
        </Typography>
      </Box>
    )
  }

  const crmStats = [
    {
      title: 'Total Leads',
      value: leadsData?.leads?.length?.toString() || '0',
      change: '+15.3%',
      trend: 'up',
      icon: <People />,
      color: '#DC143C'
    },
    {
      title: 'Conversion Rate',
      value: '23.5%',
      change: '+2.1%',
      trend: 'up',
      icon: <TrendingUp />,
      color: '#1A1A1A'
    },
    {
      title: 'Active Deals',
      value: leadsData?.leads?.filter((lead: any) => lead.status === 'hot')?.length?.toString() || '0',
      change: '-5.2%',
      trend: 'down',
      icon: <Business />,
      color: '#DC143C'
    },
    {
      title: 'Revenue Pipeline',
      value: `Rp ${(leadsData?.leads?.reduce((sum: number, lead: any) => sum + (lead.value || 0), 0) || 0).toLocaleString()}`,
      change: '+18.7%',
      trend: 'up',
      icon: <AttachMoney />,
      color: '#1A1A1A'
    }
  ]

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
            CRM & Sales Management 📊
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Kelola leads, deals, dan pipeline penjualan Anda
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportLeads}
            sx={{
              borderColor: '#DC143C',
              color: '#DC143C',
              '&:hover': {
                borderColor: '#B91C3C',
                backgroundColor: 'rgba(220, 20, 60, 0.04)'
              }
            }}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditingLead(null)
              setFormOpen(true)
            }}
            sx={{
              background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(220, 20, 60, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Add New Lead
          </Button>
        </Box>
      </Box>

      {/* CRM Features Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)', color: 'white' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Customer Relationship Management
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Kelola hubungan pelanggan dengan sistem CRM terintegrasi. Pantau sales pipeline, lead tracking, dan customer database dalam satu platform.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                }}
                startIcon={<Person />}
              >
                Lead Management
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
                startIcon={<TrendingUp />}
              >
                Sales Pipeline
              </Button>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              CRM Features
            </Typography>
            <List sx={{ py: 0 }}>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Person sx={{ color: '#4CAF50' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Lead Management"
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <TrendingUp sx={{ color: '#2196F3' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Sales Pipeline"
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Group sx={{ color: '#FF9800' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Customer Database"
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Assignment sx={{ color: '#9C27B0' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Sales Reports"
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CallMade sx={{ color: '#607D8B' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Call Tracking"
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Email sx={{ color: '#795548' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Email Integration"
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {crmStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                border: `1px solid ${stat.color}20`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${stat.color}20`
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      {stat.trend === 'up' ? (
                        <TrendingUp sx={{ color: '#4CAF50', fontSize: 16, mr: 0.5 }} />
                      ) : (
                        <TrendingDown sx={{ color: '#f44336', fontSize: 16, mr: 0.5 }} />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color: stat.trend === 'up' ? '#4CAF50' : '#f44336',
                          fontWeight: 'medium'
                        }}
                      >
                        {stat.change}
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar
                    sx={{
                      backgroundColor: `${stat.color}15`,
                      color: stat.color,
                      width: 56,
                      height: 56
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sales Pipeline */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Sales Pipeline
            </Typography>
            <Grid container spacing={2}>
              {['Qualification', 'Proposal', 'Negotiation', 'Closing'].map((stage, index) => (
                <Grid item xs={12} sm={3} key={stage}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: index === 0 ? '#DC143C10' : '#f5f5f5',
                      border: index === 0 ? '2px solid #DC143C' : '1px solid #e0e0e0'
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stage}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#DC143C', fontWeight: 'bold' }}>
                      {index === 0 ? '12' : index === 1 ? '8' : index === 2 ? '5' : '3'} deals
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rp {index === 0 ? '2.1M' : index === 1 ? '3.5M' : index === 2 ? '4.2M' : '2.6M'}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Monthly Target
            </Typography>
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Sales Target</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  78% (Rp 7.8M / Rp 10M)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={78}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#DC143C20',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#DC143C'
                  }
                }}
              />
            </Box>
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Leads Target</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  92% (184 / 200)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={92}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#1A1A1A20',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#1A1A1A'
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Paper sx={{ borderRadius: 2, mb: 3, p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search leads by company, contact, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#DC143C' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#DC143C',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#DC143C',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#DC143C',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#DC143C',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#DC143C',
                },
              }}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="hot">Hot</MenuItem>
              <MenuItem value="warm">Warm</MenuItem>
              <MenuItem value="cold">Cold</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
              }}
              sx={{
                borderColor: '#DC143C',
                color: '#DC143C',
                '&:hover': {
                  borderColor: '#B91C3C',
                  backgroundColor: 'rgba(220, 20, 60, 0.04)'
                }
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Leads Table */}
      <Paper sx={{ borderRadius: 2 }}>
        <Box p={3} borderBottom="1px solid #e0e0e0">
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Leads ({leadsData?.leads?.length || 0})
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Stage</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Last Contact</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(leadsData?.leads || []).map((lead: any) => (
                <TableRow key={lead.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {lead.company}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {lead.contactName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {lead.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(lead.status)}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(lead.status)}15`,
                        color: getStatusColor(lead.status),
                        fontWeight: 'medium'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>Rp {lead.value?.toLocaleString()}</TableCell>
                  <TableCell>{lead.stage}</TableCell>
                  <TableCell>{new Date(lead.lastContact).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton size="small" sx={{ color: '#DC143C' }}>
                        <Phone fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#DC143C' }}>
                        <Email fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, lead)}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1, fontSize: 18 }} />
          Edit Lead
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete sx={{ mr: 1, fontSize: 18, color: '#f44336' }} />
          Delete Lead
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Email sx={{ mr: 1, fontSize: 18 }} />
          Send Email
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Phone sx={{ mr: 1, fontSize: 18 }} />
          Schedule Call
        </MenuItem>
      </Menu>

      {/* Lead Form Dialog */}
      <LeadForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingLead(null)
        }}
        onSubmit={editingLead ? handleUpdateLead : handleCreateLead}
        initialData={editingLead}
        title={editingLead ? 'Edit Lead' : 'Add New Lead'}
      />

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

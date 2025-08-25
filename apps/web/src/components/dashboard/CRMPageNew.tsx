import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material'
import {
  Business,
  People,
  TrendingUp,
  AttachMoney,
  Add,
  MoreVert,
  Phone,
  Email,
  Edit,
  Delete,
  Visibility,
  Print,
  Download
} from '@mui/icons-material'
import {
  DataTable,
  Column,
  DeleteConfirmDialog,
  PrintExportMenu,
  PrintUtils,
  ExportUtils
} from '../common'
import AdvancedFilter, { FilterField, FilterValue } from '../common/AdvancedFilter'
import LeadForm from '../forms/LeadForm'
import CompanyForm from '../forms/CompanyForm'
import ContactForm from '../forms/ContactForm'
import { apiService } from '../../services/api'
import { crmApi } from '../../services/modules'

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
      id={`crm-tabpanel-${index}`}
      aria-labelledby={`crm-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function CRMPageNew() {
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Data states
  const [leads, setLeads] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  
  // Form states
  const [leadFormOpen, setLeadFormOpen] = useState(false)
  const [companyFormOpen, setCompanyFormOpen] = useState(false)
  const [contactFormOpen, setContactFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<any>(null)
  const [deleteType, setDeleteType] = useState<'lead' | 'company' | 'contact'>('lead')
  
  // Menu states
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null)
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  // Advanced filtering states (temporarily disabled)
  // const [searchTerm, setSearchTerm] = useState('')
  // const [filterValues, setFilterValues] = useState<FilterValue>({})
  // const [sortBy, setSortBy] = useState('')
  // const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Filter field configurations (temporarily disabled)
  /*const leadFilterFields: FilterField[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'hot', label: 'Hot' },
        { value: 'warm', label: 'Warm' },
        { value: 'cold', label: 'Cold' }
      ]
    },
    {
      id: 'stage',
      label: 'Stage',
      type: 'select',
      options: [
        { value: 'qualification', label: 'Qualification' },
        { value: 'proposal', label: 'Proposal' },
        { value: 'negotiation', label: 'Negotiation' },
        { value: 'closing', label: 'Closing' }
      ]
    },
    {
      id: 'value_min',
      label: 'Min Value',
      type: 'number',
      placeholder: 'Minimum deal value'
    },
    {
      id: 'value_max',
      label: 'Max Value',
      type: 'number',
      placeholder: 'Maximum deal value'
    },
    {
      id: 'created_date',
      label: 'Created Date',
      type: 'date'
    }
  ]

  */

  const companyFilterFields: FilterField[] = [
    {
      id: 'industry',
      label: 'Industry',
      type: 'select',
      options: [
        { value: 'technology', label: 'Technology' },
        { value: 'finance', label: 'Finance' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'retail', label: 'Retail' }
      ]
    },
    {
      id: 'size',
      label: 'Company Size',
      type: 'select',
      options: [
        { value: 'startup', label: 'Startup (1-10)' },
        { value: 'small', label: 'Small (11-50)' },
        { value: 'medium', label: 'Medium (51-200)' },
        { value: 'large', label: 'Large (201-1000)' },
        { value: 'enterprise', label: 'Enterprise (1000+)' }
      ]
    },
    {
      id: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'City or region'
    }
  ]

  const contactFilterFields: FilterField[] = [
    {
      id: 'department',
      label: 'Department',
      type: 'select',
      options: [
        { value: 'sales', label: 'Sales' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'it', label: 'IT' },
        { value: 'finance', label: 'Finance' },
        { value: 'hr', label: 'HR' },
        { value: 'operations', label: 'Operations' }
      ]
    },
    {
      id: 'position',
      label: 'Position Level',
      type: 'select',
      options: [
        { value: 'executive', label: 'Executive' },
        { value: 'manager', label: 'Manager' },
        { value: 'senior', label: 'Senior' },
        { value: 'junior', label: 'Junior' }
      ]
    }
  ]

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [leadsData, companiesData, contactsData] = await Promise.all([
        apiService.getLeads(),
        crmApi.getCompanies(),
        crmApi.getContacts()
      ])

      setLeads((leadsData as any)?.leads || [])
      setCompanies((companiesData as any)?.data?.data || [])
      setContacts((contactsData as any)?.data?.data || [])
    } catch (err) {
      setError('Failed to load CRM data')
      console.error('Error loading CRM data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Lead columns
  const leadColumns: Column[] = [
    {
      id: 'company',
      label: 'Company',
      minWidth: 150,
      filterable: true,
      searchable: true,
      sortable: true,
      type: 'text',
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {value?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold">{value}</Typography>
            <Typography variant="caption" color="text.secondary">{row.contactName}</Typography>
          </Box>
        </Box>
      )
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      filterable: true,
      sortable: true,
      type: 'enum',
      format: (value) => {
        const colors = { hot: '#f44336', warm: '#ff9800', cold: '#2196f3' }
        return (
          <Chip
            label={value?.toUpperCase()}
            size="small"
            sx={{
              backgroundColor: colors[value as keyof typeof colors] || '#757575',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        )
      }
    },
    {
      id: 'value',
      label: 'Value',
      minWidth: 120,
      align: 'right',
      sortable: true,
      type: 'number',
      format: (value) => `$${value?.toLocaleString() || 0}`
    },
    { 
      id: 'stage', 
      label: 'Stage', 
      minWidth: 120,
      format: (value) => (
        <Chip label={value} variant="outlined" size="small" />
      )
    },
    { 
      id: 'lastContact', 
      label: 'Last Contact', 
      minWidth: 120,
      format: (value) => new Date(value).toLocaleDateString()
    }
  ]

  // Company columns
  const companyColumns: Column[] = [
    { 
      id: 'name', 
      label: 'Company Name', 
      minWidth: 200,
      filterable: true,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
            <Business />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold">{value}</Typography>
            <Typography variant="caption" color="text.secondary">{row.industry}</Typography>
          </Box>
        </Box>
      )
    },
    { id: 'email', label: 'Email', minWidth: 180, filterable: true },
    { id: 'phone', label: 'Phone', minWidth: 140 },
    { 
      id: 'size', 
      label: 'Size', 
      minWidth: 120,
      format: (value) => value ? <Chip label={value} variant="outlined" size="small" /> : '-'
    },
    { 
      id: 'isActive', 
      label: 'Status', 
      minWidth: 100,
      format: (value) => (
        <Chip
          label={value ? 'Active' : 'Inactive'}
          color={value ? 'success' : 'default'}
          size="small"
        />
      )
    }
  ]

  // Contact columns
  const contactColumns: Column[] = [
    { 
      id: 'name', 
      label: 'Contact Name', 
      minWidth: 180,
      filterable: true,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {row.firstName?.charAt(0)}{row.lastName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {row.firstName} {row.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">{row.position}</Typography>
          </Box>
        </Box>
      )
    },
    { id: 'email', label: 'Email', minWidth: 180, filterable: true },
    { id: 'phone', label: 'Phone', minWidth: 140 },
    { 
      id: 'companyName', 
      label: 'Company', 
      minWidth: 150,
      filterable: true
    },
    { 
      id: 'isActive', 
      label: 'Status', 
      minWidth: 100,
      format: (value) => (
        <Chip
          label={value ? 'Active' : 'Inactive'}
          color={value ? 'success' : 'default'}
          size="small"
        />
      )
    }
  ]

  // CRUD handlers for Leads
  const handleCreateLead = async (data: any) => {
    try {
      await apiService.createLead(data)
      await loadData()
      setSnackbar({ open: true, message: 'Lead created successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create lead', severity: 'error' })
    }
  }

  const handleUpdateLead = async (data: any) => {
    try {
      await apiService.updateLead(editingItem.id, data)
      await loadData()
      setSnackbar({ open: true, message: 'Lead updated successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update lead', severity: 'error' })
    }
  }

  const handleDeleteLead = async () => {
    try {
      await apiService.deleteLead(itemToDelete.id)
      await loadData()
      setSnackbar({ open: true, message: 'Lead deleted successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete lead', severity: 'error' })
    }
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  // CRUD handlers for Companies
  const handleCreateCompany = async (data: any) => {
    try {
      // await apiService.createCompany(data)
      await loadData()
      setSnackbar({ open: true, message: 'Company created successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create company', severity: 'error' })
    }
  }

  // CRUD handlers for Contacts
  const handleCreateContact = async (data: any) => {
    try {
      // await apiService.createContact(data)
      await loadData()
      setSnackbar({ open: true, message: 'Contact created successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create contact', severity: 'error' })
    }
  }

  // Generic handlers
  const handleEdit = (item: any) => {
    setEditingItem(item)
    if (tabValue === 0) setLeadFormOpen(true)
    else if (tabValue === 1) setCompanyFormOpen(true)
    else if (tabValue === 2) setContactFormOpen(true)
  }

  const handleDelete = (item: any) => {
    setItemToDelete(item)
    setDeleteType(tabValue === 0 ? 'lead' : tabValue === 1 ? 'company' : 'contact')
    setDeleteDialogOpen(true)
  }

  const handleView = (item: any) => {
    console.log('View item:', item)
    // Implement view functionality
  }

  const handlePrint = (items: any[]) => {
    const currentColumns = tabValue === 0 ? leadColumns : tabValue === 1 ? companyColumns : contactColumns
    const title = `CRM ${tabValue === 0 ? 'Leads' : tabValue === 1 ? 'Companies' : 'Contacts'} Report`
    PrintUtils.printTable(items, currentColumns, title)
  }

  const handleExport = (items: any[]) => {
    const currentColumns = tabValue === 0 ? leadColumns : tabValue === 1 ? companyColumns : contactColumns
    const filename = `crm_${tabValue === 0 ? 'leads' : tabValue === 1 ? 'companies' : 'contacts'}_${new Date().toISOString().split('T')[0]}`
    ExportUtils.exportToCSV(items, currentColumns, filename)
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            CRM Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your customer relationships and sales pipeline
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6">{leads.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Leads</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <Business />
                </Avatar>
                <Box>
                  <Typography variant="h6">{companies.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Companies</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h6">{contacts.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Contacts</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    ${leads.reduce((sum, lead) => sum + (lead.value || 0), 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Pipeline Value</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Leads" />
          <Tab label="Companies" />
          <Tab label="Contacts" />
        </Tabs>

        {/* Leads Tab */}
        <TabPanel value={tabValue} index={0}>
          <DataTable
            title="Sales Leads"
            columns={leadColumns}
            data={leads}
            loading={loading}
            error={error}
            onAdd={() => setLeadFormOpen(true)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
            onExport={handleExport}
            onRefresh={loadData}
            selectable
          />
        </TabPanel>

        {/* Companies Tab */}
        <TabPanel value={tabValue} index={1}>
          <DataTable
            title="Companies"
            columns={companyColumns}
            data={companies}
            loading={loading}
            error={error}
            onAdd={() => setCompanyFormOpen(true)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
            onExport={handleExport}
            onRefresh={loadData}
            selectable
          />
        </TabPanel>

        {/* Contacts Tab */}
        <TabPanel value={tabValue} index={2}>
          <DataTable
            title="Contacts"
            columns={contactColumns}
            data={contacts}
            loading={loading}
            error={error}
            onAdd={() => setContactFormOpen(true)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
            onExport={handleExport}
            onRefresh={loadData}
            selectable
          />
        </TabPanel>
      </Paper>

      {/* Forms */}
      <LeadForm
        open={leadFormOpen}
        onClose={() => {
          setLeadFormOpen(false)
          setEditingItem(null)
        }}
        onSubmit={editingItem ? handleUpdateLead : handleCreateLead}
        initialData={editingItem}
      />

      <CompanyForm
        open={companyFormOpen}
        onClose={() => {
          setCompanyFormOpen(false)
          setEditingItem(null)
        }}
        onSubmit={editingItem ? handleCreateCompany : handleCreateCompany}
        initialData={editingItem}
        mode={editingItem ? 'edit' : 'create'}
      />

      <ContactForm
        open={contactFormOpen}
        onClose={() => {
          setContactFormOpen(false)
          setEditingItem(null)
        }}
        onSubmit={editingItem ? handleCreateContact : handleCreateContact}
        initialData={editingItem}
        mode={editingItem ? 'edit' : 'create'}
        companies={companies}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteLead}
        itemName={itemToDelete?.company || itemToDelete?.name || 'item'}
        itemType={deleteType}
      />

      {/* Snackbar */}
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

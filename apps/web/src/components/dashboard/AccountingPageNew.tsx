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
  Alert,
  LinearProgress
} from '@mui/material'
import {
  AccountBalance,
  Receipt,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Assessment,
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Print,
  Download,
  CheckCircle,
  Cancel,
  Pending
} from '@mui/icons-material'
import { 
  DataTable, 
  Column, 
  DeleteConfirmDialog, 
  PrintExportMenu,
  PrintUtils,
  ExportUtils
} from '../common'
import AccountForm from '../forms/AccountForm'
import JournalEntryForm from '../forms/JournalEntryForm'
import { apiService } from '../../services/api'

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
      id={`accounting-tabpanel-${index}`}
      aria-labelledby={`accounting-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AccountingPageNew() {
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Data states
  const [accounts, setAccounts] = useState<any[]>([])
  const [journalEntries, setJournalEntries] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  
  // Form states
  const [accountFormOpen, setAccountFormOpen] = useState(false)
  const [journalFormOpen, setJournalFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<any>(null)
  const [deleteType, setDeleteType] = useState<'account' | 'journal' | 'transaction'>('account')
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  })

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Mock data for Accounting
      setAccounts([
        {
          id: 1,
          code: '1001',
          name: 'Cash in Hand',
          type: 'asset',
          subType: 'Current Asset',
          balance: 50000,
          currency: 'IDR',
          isActive: true,
          isTaxAccount: false
        },
        {
          id: 2,
          code: '1002',
          name: 'Bank Account',
          type: 'asset',
          subType: 'Current Asset',
          balance: 250000,
          currency: 'IDR',
          isActive: true,
          isTaxAccount: false
        },
        {
          id: 3,
          code: '4001',
          name: 'Sales Revenue',
          type: 'revenue',
          subType: 'Operating Revenue',
          balance: 500000,
          currency: 'IDR',
          isActive: true,
          isTaxAccount: true,
          taxRate: 11
        },
        {
          id: 4,
          code: '5001',
          name: 'Office Expenses',
          type: 'expense',
          subType: 'Operating Expense',
          balance: 75000,
          currency: 'IDR',
          isActive: true,
          isTaxAccount: false
        }
      ])

      setJournalEntries([
        {
          id: 1,
          entryNumber: 'JE2024-001',
          date: '2024-01-15',
          description: 'Sales transaction',
          totalDebit: 100000,
          totalCredit: 100000,
          status: 'posted',
          lineItemsCount: 2
        },
        {
          id: 2,
          entryNumber: 'JE2024-002',
          date: '2024-01-16',
          description: 'Office supplies purchase',
          totalDebit: 25000,
          totalCredit: 25000,
          status: 'draft',
          lineItemsCount: 2
        }
      ])

      setTransactions([
        {
          id: 1,
          transactionNumber: 'EX2024-001',
          date: '2024-01-15',
          type: 'expense',
          category: 'Office Supplies',
          amount: 25000,
          description: 'Office supplies purchase',
          status: 'completed',
          accountName: 'Cash in Hand'
        },
        {
          id: 2,
          transactionNumber: 'IN2024-001',
          date: '2024-01-16',
          type: 'income',
          category: 'Sales Revenue',
          amount: 100000,
          description: 'Product sales',
          status: 'completed',
          accountName: 'Bank Account'
        }
      ])
    } catch (err) {
      setError('Failed to load accounting data')
      console.error('Error loading accounting data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Account columns
  const accountColumns: Column[] = [
    { 
      id: 'code', 
      label: 'Code', 
      minWidth: 100,
      filterable: true
    },
    { 
      id: 'name', 
      label: 'Account Name', 
      minWidth: 200,
      filterable: true,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            <AccountBalance />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold">{value}</Typography>
            <Typography variant="caption" color="text.secondary">
              {row.subType}
            </Typography>
          </Box>
        </Box>
      )
    },
    { 
      id: 'type', 
      label: 'Type', 
      minWidth: 120,
      format: (value) => {
        const colors = {
          asset: '#4caf50',
          liability: '#f44336',
          equity: '#2196f3',
          revenue: '#ff9800',
          expense: '#9c27b0'
        }
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
      id: 'balance', 
      label: 'Balance', 
      minWidth: 120,
      align: 'right',
      format: (value, row) => `${row.currency} ${value?.toLocaleString() || 0}`
    },
    { 
      id: 'isTaxAccount', 
      label: 'Tax Account', 
      minWidth: 100,
      format: (value, row) => value ? (
        <Chip
          label={`${row.taxRate}%`}
          color="warning"
          size="small"
        />
      ) : '-'
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

  // Journal Entry columns
  const journalColumns: Column[] = [
    { id: 'entryNumber', label: 'Entry Number', minWidth: 140, filterable: true },
    { 
      id: 'date', 
      label: 'Date', 
      minWidth: 120,
      format: (value) => new Date(value).toLocaleDateString()
    },
    { id: 'description', label: 'Description', minWidth: 200, filterable: true },
    { 
      id: 'totalDebit', 
      label: 'Total Debit', 
      minWidth: 120,
      align: 'right',
      format: (value) => `IDR ${value?.toLocaleString() || 0}`
    },
    { 
      id: 'totalCredit', 
      label: 'Total Credit', 
      minWidth: 120,
      align: 'right',
      format: (value) => `IDR ${value?.toLocaleString() || 0}`
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 100,
      format: (value) => {
        const config = {
          draft: { label: 'Draft', color: 'default', icon: <Pending /> },
          posted: { label: 'Posted', color: 'success', icon: <CheckCircle /> },
          reversed: { label: 'Reversed', color: 'error', icon: <Cancel /> }
        }
        const item = config[value as keyof typeof config]
        return item ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {item.icon}
            <Chip label={item.label} color={item.color as any} size="small" />
          </Box>
        ) : value
      }
    },
    { 
      id: 'lineItemsCount', 
      label: 'Lines', 
      minWidth: 80,
      align: 'center'
    }
  ]

  // Transaction columns
  const transactionColumns: Column[] = [
    { id: 'transactionNumber', label: 'Transaction #', minWidth: 140, filterable: true },
    { 
      id: 'date', 
      label: 'Date', 
      minWidth: 120,
      format: (value) => new Date(value).toLocaleDateString()
    },
    { 
      id: 'type', 
      label: 'Type', 
      minWidth: 100,
      format: (value) => {
        const config = {
          income: { label: 'Income', color: 'success', icon: '💰' },
          expense: { label: 'Expense', color: 'error', icon: '💸' },
          transfer: { label: 'Transfer', color: 'info', icon: '🔄' }
        }
        const item = config[value as keyof typeof config]
        return item ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>{item.icon}</span>
            <Chip label={item.label} color={item.color as any} size="small" />
          </Box>
        ) : value
      }
    },
    { id: 'category', label: 'Category', minWidth: 140, filterable: true },
    { 
      id: 'amount', 
      label: 'Amount', 
      minWidth: 120,
      align: 'right',
      format: (value) => `IDR ${value?.toLocaleString() || 0}`
    },
    { id: 'description', label: 'Description', minWidth: 180, filterable: true },
    { id: 'accountName', label: 'Account', minWidth: 140, filterable: true },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 100,
      format: (value) => {
        const colors = { 
          pending: 'warning', 
          completed: 'success', 
          cancelled: 'error' 
        }
        return (
          <Chip
            label={value?.toUpperCase()}
            color={colors[value as keyof typeof colors] as any}
            size="small"
          />
        )
      }
    }
  ]

  // CRUD handlers
  const handleCreateAccount = async (data: any) => {
    try {
      // await apiService.createAccount(data)
      await loadData()
      setSnackbar({ open: true, message: 'Account created successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create account', severity: 'error' })
    }
  }

  const handleCreateJournalEntry = async (data: any) => {
    try {
      // await apiService.createJournalEntry(data)
      await loadData()
      setSnackbar({ open: true, message: 'Journal entry created successfully', severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create journal entry', severity: 'error' })
    }
  }

  // Generic handlers
  const handleEdit = (item: any) => {
    setEditingItem(item)
    if (tabValue === 0) setAccountFormOpen(true)
    else if (tabValue === 1) setJournalFormOpen(true)
  }

  const handleDelete = (item: any) => {
    setItemToDelete(item)
    setDeleteType(tabValue === 0 ? 'account' : tabValue === 1 ? 'journal' : 'transaction')
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      // await apiService.deleteItem(itemToDelete.id)
      await loadData()
      setSnackbar({ open: true, message: `${deleteType} deleted successfully`, severity: 'success' })
    } catch (error) {
      setSnackbar({ open: true, message: `Failed to delete ${deleteType}`, severity: 'error' })
    }
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const handleView = (item: any) => {
    console.log('View item:', item)
    // Implement view functionality
  }

  const handlePrint = (items: any[]) => {
    const currentColumns = tabValue === 0 ? accountColumns : tabValue === 1 ? journalColumns : transactionColumns
    const title = `Accounting ${tabValue === 0 ? 'Chart of Accounts' : tabValue === 1 ? 'Journal Entries' : 'Transactions'} Report`
    PrintUtils.printTable(items, currentColumns, title)
  }

  const handleExport = (items: any[]) => {
    const currentColumns = tabValue === 0 ? accountColumns : tabValue === 1 ? journalColumns : transactionColumns
    const filename = `accounting_${tabValue === 0 ? 'accounts' : tabValue === 1 ? 'journal_entries' : 'transactions'}_${new Date().toISOString().split('T')[0]}`
    ExportUtils.exportToCSV(items, currentColumns, filename)
  }

  // Calculate stats
  const totalAssets = accounts.filter(a => a.type === 'asset').reduce((sum, a) => sum + a.balance, 0)
  const totalLiabilities = accounts.filter(a => a.type === 'liability').reduce((sum, a) => sum + a.balance, 0)
  const totalRevenue = accounts.filter(a => a.type === 'revenue').reduce((sum, a) => sum + a.balance, 0)
  const totalExpenses = accounts.filter(a => a.type === 'expense').reduce((sum, a) => sum + a.balance, 0)

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Accounting & Finance
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage chart of accounts, journal entries, and financial transactions
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6">IDR {totalAssets.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Assets</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <TrendingDown />
                </Avatar>
                <Box>
                  <Typography variant="h6">IDR {totalLiabilities.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Liabilities</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h6">IDR {totalRevenue.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Assessment />
                </Avatar>
                <Box>
                  <Typography variant="h6">IDR {totalExpenses.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Expenses</Typography>
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
          <Tab label="Chart of Accounts" />
          <Tab label="Journal Entries" />
          <Tab label="Transactions" />
        </Tabs>

        {/* Chart of Accounts Tab */}
        <TabPanel value={tabValue} index={0}>
          <DataTable
            title="Chart of Accounts"
            columns={accountColumns}
            data={accounts}
            loading={loading}
            error={error}
            onAdd={() => setAccountFormOpen(true)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
            onExport={handleExport}
            onRefresh={loadData}
            selectable
          />
        </TabPanel>

        {/* Journal Entries Tab */}
        <TabPanel value={tabValue} index={1}>
          <DataTable
            title="Journal Entries"
            columns={journalColumns}
            data={journalEntries}
            loading={loading}
            error={error}
            onAdd={() => setJournalFormOpen(true)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onPrint={handlePrint}
            onExport={handleExport}
            onRefresh={loadData}
            selectable
          />
        </TabPanel>

        {/* Transactions Tab */}
        <TabPanel value={tabValue} index={2}>
          <DataTable
            title="Financial Transactions"
            columns={transactionColumns}
            data={transactions}
            loading={loading}
            error={error}
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
      <AccountForm
        open={accountFormOpen}
        onClose={() => {
          setAccountFormOpen(false)
          setEditingItem(null)
        }}
        onSubmit={editingItem ? handleCreateAccount : handleCreateAccount}
        initialData={editingItem}
        mode={editingItem ? 'edit' : 'create'}
        parentAccounts={accounts}
      />

      <JournalEntryForm
        open={journalFormOpen}
        onClose={() => {
          setJournalFormOpen(false)
          setEditingItem(null)
        }}
        onSubmit={editingItem ? handleCreateJournalEntry : handleCreateJournalEntry}
        initialData={editingItem}
        mode={editingItem ? 'edit' : 'create'}
        accounts={accounts}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete?.name || itemToDelete?.entryNumber || itemToDelete?.transactionNumber || 'item'}
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

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
  Grid,
  Divider,
  Fab,
  Tooltip
} from '@mui/material'
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  PostAdd,
  Receipt,
  Payment,
  AccountBalance,
  Remove,
  Save,
  Cancel
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { 
  JournalEntry, 
  JournalLineItem,
  JournalEntryFormData,
  JournalLineItemFormData,
  TransactionType,
  Account,
  getTransactionTypeDisplayName,
  formatCurrency
} from '../../types/accounting'
import { usePermissions } from '../../hooks/usePermissions'
import PermissionGuard from '../auth/PermissionGuard'

// Mock data
const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    entryNumber: 'JE-001',
    date: '2024-01-15',
    description: 'Office supplies purchase',
    reference: 'INV-001',
    type: TransactionType.JOURNAL_ENTRY,
    totalDebit: 500000,
    totalCredit: 500000,
    isPosted: true,
    createdBy: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    lineItems: [
      {
        id: '1',
        journalEntryId: '1',
        accountId: '7',
        description: 'Office supplies',
        debitAmount: 500000,
        creditAmount: 0,
        sortOrder: 1
      },
      {
        id: '2',
        journalEntryId: '1',
        accountId: '1',
        description: 'Cash payment',
        debitAmount: 0,
        creditAmount: 500000,
        sortOrder: 2
      }
    ]
  },
  {
    id: '2',
    entryNumber: 'JE-002',
    date: '2024-01-16',
    description: 'Sales revenue',
    reference: 'INV-002',
    type: TransactionType.INVOICE,
    totalDebit: 2500000,
    totalCredit: 2500000,
    isPosted: false,
    createdBy: 'admin',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    lineItems: [
      {
        id: '3',
        journalEntryId: '2',
        accountId: '2',
        description: 'Accounts receivable',
        debitAmount: 2500000,
        creditAmount: 0,
        sortOrder: 1
      },
      {
        id: '4',
        journalEntryId: '2',
        accountId: '6',
        description: 'Sales revenue',
        debitAmount: 0,
        creditAmount: 2500000,
        sortOrder: 2
      }
    ]
  }
]

const mockAccounts: Account[] = [
  { id: '1', code: '1000', name: 'Cash', type: 'asset' as any, subType: 'current_asset' as any, balance: 50000000, isActive: true, createdAt: '', updatedAt: '' },
  { id: '2', code: '1100', name: 'Accounts Receivable', type: 'asset' as any, subType: 'current_asset' as any, balance: 25000000, isActive: true, createdAt: '', updatedAt: '' },
  { id: '6', code: '4000', name: 'Sales Revenue', type: 'revenue' as any, subType: 'operating_revenue' as any, balance: 75000000, isActive: true, createdAt: '', updatedAt: '' },
  { id: '7', code: '5000', name: 'Office Supplies Expense', type: 'expense' as any, subType: 'operating_expense' as any, balance: 5000000, isActive: true, createdAt: '', updatedAt: '' }
]

export default function JournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>(mockJournalEntries)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create')
  const [formData, setFormData] = useState<JournalEntryFormData>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    type: TransactionType.JOURNAL_ENTRY,
    lineItems: [
      { accountId: '', description: '', debitAmount: 0, creditAmount: 0 },
      { accountId: '', description: '', debitAmount: 0, creditAmount: 0 }
    ]
  })

  const { canPerformAction } = usePermissions()

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, entry: JournalEntry) => {
    setAnchorEl(event.currentTarget)
    setSelectedEntry(entry)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedEntry(null)
  }

  const handleCreateEntry = () => {
    setDialogMode('create')
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      type: TransactionType.JOURNAL_ENTRY,
      lineItems: [
        { accountId: '', description: '', debitAmount: 0, creditAmount: 0 },
        { accountId: '', description: '', debitAmount: 0, creditAmount: 0 }
      ]
    })
    setOpenDialog(true)
  }

  const handleEditEntry = () => {
    if (selectedEntry) {
      setDialogMode('edit')
      setFormData({
        date: selectedEntry.date,
        description: selectedEntry.description,
        reference: selectedEntry.reference || '',
        type: selectedEntry.type,
        lineItems: selectedEntry.lineItems.map(item => ({
          accountId: item.accountId,
          description: item.description || '',
          debitAmount: item.debitAmount,
          creditAmount: item.creditAmount
        }))
      })
      setOpenDialog(true)
    }
    handleMenuClose()
  }

  const handleViewEntry = () => {
    if (selectedEntry) {
      setDialogMode('view')
      setFormData({
        date: selectedEntry.date,
        description: selectedEntry.description,
        reference: selectedEntry.reference || '',
        type: selectedEntry.type,
        lineItems: selectedEntry.lineItems.map(item => ({
          accountId: item.accountId,
          description: item.description || '',
          debitAmount: item.debitAmount,
          creditAmount: item.creditAmount
        }))
      })
      setOpenDialog(true)
    }
    handleMenuClose()
  }

  const handlePostEntry = () => {
    if (selectedEntry && !selectedEntry.isPosted) {
      setEntries(entries.map(entry => 
        entry.id === selectedEntry.id 
          ? { ...entry, isPosted: true, updatedAt: new Date().toISOString() }
          : entry
      ))
    }
    handleMenuClose()
  }

  const handleDeleteEntry = () => {
    if (selectedEntry) {
      setEntries(entries.filter(entry => entry.id !== selectedEntry.id))
    }
    handleMenuClose()
  }

  const addLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [
        ...formData.lineItems,
        { accountId: '', description: '', debitAmount: 0, creditAmount: 0 }
      ]
    })
  }

  const removeLineItem = (index: number) => {
    if (formData.lineItems.length > 2) {
      setFormData({
        ...formData,
        lineItems: formData.lineItems.filter((_, i) => i !== index)
      })
    }
  }

  const updateLineItem = (index: number, field: keyof JournalLineItemFormData, value: any) => {
    const updatedLineItems = formData.lineItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    )
    setFormData({ ...formData, lineItems: updatedLineItems })
  }

  const getTotalDebits = () => {
    return formData.lineItems.reduce((sum, item) => sum + (item.debitAmount || 0), 0)
  }

  const getTotalCredits = () => {
    return formData.lineItems.reduce((sum, item) => sum + (item.creditAmount || 0), 0)
  }

  const isBalanced = () => {
    return getTotalDebits() === getTotalCredits() && getTotalDebits() > 0
  }

  const handleSaveEntry = () => {
    if (!isBalanced()) {
      alert('Journal entry must be balanced (total debits = total credits)')
      return
    }

    if (dialogMode === 'create') {
      const newEntry: JournalEntry = {
        id: (Math.max(...entries.map(e => parseInt(e.id))) + 1).toString(),
        entryNumber: `JE-${String(entries.length + 1).padStart(3, '0')}`,
        ...formData,
        totalDebit: getTotalDebits(),
        totalCredit: getTotalCredits(),
        isPosted: false,
        createdBy: 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lineItems: formData.lineItems.map((item, index) => ({
          id: `${entries.length + 1}-${index + 1}`,
          journalEntryId: (entries.length + 1).toString(),
          ...item,
          sortOrder: index + 1
        }))
      }
      setEntries([...entries, newEntry])
    } else if (selectedEntry && dialogMode === 'edit') {
      setEntries(entries.map(entry => 
        entry.id === selectedEntry.id 
          ? { 
              ...entry, 
              ...formData,
              totalDebit: getTotalDebits(),
              totalCredit: getTotalCredits(),
              updatedAt: new Date().toISOString(),
              lineItems: formData.lineItems.map((item, index) => ({
                id: `${entry.id}-${index + 1}`,
                journalEntryId: entry.id,
                ...item,
                sortOrder: index + 1
              }))
            }
          : entry
      ))
    }
    setOpenDialog(false)
  }

  const getAccountName = (accountId: string) => {
    const account = mockAccounts.find(acc => acc.id === accountId)
    return account ? `${account.code} - ${account.name}` : 'Unknown Account'
  }

  const getTransactionTypeColor = (type: TransactionType) => {
    const colors = {
      [TransactionType.JOURNAL_ENTRY]: '#2196F3',
      [TransactionType.INVOICE]: '#4CAF50',
      [TransactionType.PAYMENT]: '#FF9800',
      [TransactionType.RECEIPT]: '#9C27B0',
      [TransactionType.ADJUSTMENT]: '#f44336'
    }
    return colors[type]
  }

  return (
    <PermissionGuard module="accounting" action="read">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Journal Entries
            </Typography>
            
            <PermissionGuard module="accounting" action="create" showFallback={false}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateEntry}
                sx={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                  }
                }}
              >
                New Journal Entry
              </Button>
            </PermissionGuard>
          </Box>

          <Card>
            <CardContent>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Entry #</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entries.map((entry) => (
                      <TableRow key={entry.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {entry.entryNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(entry.date).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {entry.description}
                          </Typography>
                          {entry.reference && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              Ref: {entry.reference}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getTransactionTypeDisplayName(entry.type)}
                            size="small"
                            sx={{
                              backgroundColor: getTransactionTypeColor(entry.type),
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(entry.totalDebit)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={entry.isPosted ? 'Posted' : 'Draft'}
                            size="small"
                            color={entry.isPosted ? 'success' : 'warning'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, entry)}
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
            <MenuItem onClick={handleViewEntry}>
              <Visibility sx={{ mr: 1 }} />
              View Details
            </MenuItem>
            {selectedEntry && !selectedEntry.isPosted && (
              <PermissionGuard module="accounting" action="update" showFallback={false}>
                <MenuItem onClick={handleEditEntry}>
                  <Edit sx={{ mr: 1 }} />
                  Edit Entry
                </MenuItem>
              </PermissionGuard>
            )}
            {selectedEntry && !selectedEntry.isPosted && (
              <PermissionGuard module="accounting" action="update" showFallback={false}>
                <MenuItem onClick={handlePostEntry}>
                  <PostAdd sx={{ mr: 1 }} />
                  Post Entry
                </MenuItem>
              </PermissionGuard>
            )}
            {selectedEntry && !selectedEntry.isPosted && (
              <PermissionGuard module="accounting" action="delete" showFallback={false}>
                <MenuItem onClick={handleDeleteEntry} sx={{ color: 'error.main' }}>
                  <Delete sx={{ mr: 1 }} />
                  Delete Entry
                </MenuItem>
              </PermissionGuard>
            )}
          </Menu>

          {/* Create/Edit Journal Entry Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
            <DialogTitle>
              {dialogMode === 'create' ? 'New Journal Entry' : 
               dialogMode === 'edit' ? 'Edit Journal Entry' : 'Journal Entry Details'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Date"
                    value={new Date(formData.date)}
                    onChange={(date) => setFormData({ ...formData, date: date?.toISOString().split('T')[0] || '' })}
                    disabled={dialogMode === 'view'}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth disabled={dialogMode === 'view'}>
                    <InputLabel>Transaction Type</InputLabel>
                    <Select
                      value={formData.type}
                      label="Transaction Type"
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
                    >
                      {Object.values(TransactionType).map((type) => (
                        <MenuItem key={type} value={type}>
                          {getTransactionTypeDisplayName(type)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={dialogMode === 'view'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Reference"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    disabled={dialogMode === 'view'}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Line Items
              </Typography>

              {formData.lineItems.map((lineItem, index) => (
                <Card key={index} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth disabled={dialogMode === 'view'}>
                          <InputLabel>Account</InputLabel>
                          <Select
                            value={lineItem.accountId}
                            label="Account"
                            onChange={(e) => updateLineItem(index, 'accountId', e.target.value)}
                          >
                            {mockAccounts.map((account) => (
                              <MenuItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Description"
                          value={lineItem.description}
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          disabled={dialogMode === 'view'}
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          fullWidth
                          label="Debit"
                          type="number"
                          value={lineItem.debitAmount || ''}
                          onChange={(e) => updateLineItem(index, 'debitAmount', parseFloat(e.target.value) || 0)}
                          disabled={dialogMode === 'view'}
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          fullWidth
                          label="Credit"
                          type="number"
                          value={lineItem.creditAmount || ''}
                          onChange={(e) => updateLineItem(index, 'creditAmount', parseFloat(e.target.value) || 0)}
                          disabled={dialogMode === 'view'}
                        />
                      </Grid>
                      <Grid item xs={12} md={1}>
                        {dialogMode !== 'view' && formData.lineItems.length > 2 && (
                          <IconButton onClick={() => removeLineItem(index)} color="error">
                            <Remove />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}

              {dialogMode !== 'view' && (
                <Button
                  startIcon={<Add />}
                  onClick={addLineItem}
                  sx={{ mb: 2 }}
                >
                  Add Line Item
                </Button>
              )}

              <Card sx={{ backgroundColor: '#f5f5f5' }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">
                        Total Debits: {formatCurrency(getTotalDebits())}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">
                        Total Credits: {formatCurrency(getTotalCredits())}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      {isBalanced() ? (
                        <Alert severity="success">Entry is balanced</Alert>
                      ) : (
                        <Alert severity="error">
                          Entry is not balanced. Difference: {formatCurrency(Math.abs(getTotalDebits() - getTotalCredits()))}
                        </Alert>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>
                {dialogMode === 'view' ? 'Close' : 'Cancel'}
              </Button>
              {dialogMode !== 'view' && (
                <Button 
                  onClick={handleSaveEntry}
                  variant="contained"
                  disabled={!isBalanced()}
                  sx={{
                    background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                    }
                  }}
                >
                  {dialogMode === 'create' ? 'Create Entry' : 'Save Changes'}
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Box>
      </LocalizationProvider>
    </PermissionGuard>
  )
}

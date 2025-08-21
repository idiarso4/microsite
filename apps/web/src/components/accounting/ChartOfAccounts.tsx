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
  Tooltip,

} from '@mui/material'
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  ExpandMore,
  ChevronRight,
  AccountBalance,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material'
import { 
  Account, 
  AccountType, 
  AccountSubType, 
  AccountFormData,
  getAccountTypeDisplayName,
  getAccountSubTypeDisplayName,
  formatCurrency,
  isDebitAccount
} from '../../types/accounting'
import { usePermissions } from '../../hooks/usePermissions'
import PermissionGuard from '../auth/PermissionGuard'

// Mock data
const mockAccounts: Account[] = [
  {
    id: '1',
    code: '1000',
    name: 'Cash',
    type: AccountType.ASSET,
    subType: AccountSubType.CURRENT_ASSET,
    balance: 50000000,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    code: '1100',
    name: 'Accounts Receivable',
    type: AccountType.ASSET,
    subType: AccountSubType.CURRENT_ASSET,
    balance: 25000000,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '3',
    code: '1500',
    name: 'Equipment',
    type: AccountType.ASSET,
    subType: AccountSubType.FIXED_ASSET,
    balance: 100000000,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '4',
    code: '2000',
    name: 'Accounts Payable',
    type: AccountType.LIABILITY,
    subType: AccountSubType.CURRENT_LIABILITY,
    balance: 15000000,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '5',
    code: '3000',
    name: 'Owner Equity',
    type: AccountType.EQUITY,
    subType: AccountSubType.OWNER_EQUITY,
    balance: 160000000,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '6',
    code: '4000',
    name: 'Sales Revenue',
    type: AccountType.REVENUE,
    subType: AccountSubType.OPERATING_REVENUE,
    balance: 75000000,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '7',
    code: '5000',
    name: 'Office Supplies Expense',
    type: AccountType.EXPENSE,
    subType: AccountSubType.OPERATING_EXPENSE,
    balance: 5000000,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  }
]

export default function ChartOfAccounts() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create')
  const [formData, setFormData] = useState<AccountFormData>({
    code: '',
    name: '',
    type: AccountType.ASSET,
    subType: AccountSubType.CURRENT_ASSET,
    description: ''
  })
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table')

  const { canPerformAction } = usePermissions()

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, account: Account) => {
    setAnchorEl(event.currentTarget)
    setSelectedAccount(account)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedAccount(null)
  }

  const handleCreateAccount = () => {
    setDialogMode('create')
    setFormData({
      code: '',
      name: '',
      type: AccountType.ASSET,
      subType: AccountSubType.CURRENT_ASSET,
      description: ''
    })
    setOpenDialog(true)
  }

  const handleEditAccount = () => {
    if (selectedAccount) {
      setDialogMode('edit')
      setFormData({
        code: selectedAccount.code,
        name: selectedAccount.name,
        type: selectedAccount.type,
        subType: selectedAccount.subType,
        description: selectedAccount.description || ''
      })
      setOpenDialog(true)
    }
    handleMenuClose()
  }

  const handleViewAccount = () => {
    if (selectedAccount) {
      setDialogMode('view')
      setFormData({
        code: selectedAccount.code,
        name: selectedAccount.name,
        type: selectedAccount.type,
        subType: selectedAccount.subType,
        description: selectedAccount.description || ''
      })
      setOpenDialog(true)
    }
    handleMenuClose()
  }

  const handleDeleteAccount = () => {
    if (selectedAccount) {
      setAccounts(accounts.filter(account => account.id !== selectedAccount.id))
    }
    handleMenuClose()
  }

  const handleSaveAccount = () => {
    if (dialogMode === 'create') {
      const newAccount: Account = {
        id: (Math.max(...accounts.map(a => parseInt(a.id))) + 1).toString(),
        ...formData,
        balance: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setAccounts([...accounts, newAccount])
    } else if (selectedAccount && dialogMode === 'edit') {
      setAccounts(accounts.map(account => 
        account.id === selectedAccount.id 
          ? { ...account, ...formData, updatedAt: new Date().toISOString() }
          : account
      ))
    }
    setOpenDialog(false)
  }

  const getAccountTypeColor = (type: AccountType) => {
    const colors = {
      [AccountType.ASSET]: '#4CAF50',
      [AccountType.LIABILITY]: '#f44336',
      [AccountType.EQUITY]: '#2196F3',
      [AccountType.REVENUE]: '#FF9800',
      [AccountType.EXPENSE]: '#9C27B0'
    }
    return colors[type]
  }

  const getSubTypeOptions = (type: AccountType) => {
    const options = {
      [AccountType.ASSET]: [
        AccountSubType.CURRENT_ASSET,
        AccountSubType.FIXED_ASSET,
        AccountSubType.INTANGIBLE_ASSET
      ],
      [AccountType.LIABILITY]: [
        AccountSubType.CURRENT_LIABILITY,
        AccountSubType.LONG_TERM_LIABILITY
      ],
      [AccountType.EQUITY]: [
        AccountSubType.OWNER_EQUITY,
        AccountSubType.RETAINED_EARNINGS
      ],
      [AccountType.REVENUE]: [
        AccountSubType.OPERATING_REVENUE,
        AccountSubType.NON_OPERATING_REVENUE
      ],
      [AccountType.EXPENSE]: [
        AccountSubType.OPERATING_EXPENSE,
        AccountSubType.NON_OPERATING_EXPENSE,
        AccountSubType.COST_OF_GOODS_SOLD
      ]
    }
    return options[type] || []
  }

  const groupedAccounts = accounts.reduce((groups, account) => {
    const type = account.type
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(account)
    return groups
  }, {} as Record<AccountType, Account[]>)

  return (
    <PermissionGuard module="accounting" action="read">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Chart of Accounts
          </Typography>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => setViewMode(viewMode === 'table' ? 'tree' : 'table')}
            >
              {viewMode === 'table' ? 'Tree View' : 'Table View'}
            </Button>
            
            <PermissionGuard module="accounting" action="create" showFallback={false}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateAccount}
                sx={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                  }
                }}
              >
                Add Account
              </Button>
            </PermissionGuard>
          </Stack>
        </Box>

        <Card>
          <CardContent>
            {viewMode === 'table' ? (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Account Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Sub Type</TableCell>
                      <TableCell align="right">Balance</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(groupedAccounts).map(([type, typeAccounts]) => (
                      <React.Fragment key={type}>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell colSpan={7}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {getAccountTypeDisplayName(type as AccountType)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        {typeAccounts.map((account) => (
                          <TableRow key={account.id} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                {account.code}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {account.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getAccountTypeDisplayName(account.type)}
                                size="small"
                                sx={{
                                  backgroundColor: getAccountTypeColor(account.type),
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {getAccountSubTypeDisplayName(account.subType)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {formatCurrency(account.balance)}
                                </Typography>
                                {account.balance > 0 && (
                                  <Tooltip title={isDebitAccount(account.type) ? 'Debit Balance' : 'Credit Balance'}>
                                    {isDebitAccount(account.type) ? (
                                      <TrendingUp sx={{ ml: 1, color: '#4CAF50', fontSize: 16 }} />
                                    ) : (
                                      <TrendingDown sx={{ ml: 1, color: '#f44336', fontSize: 16 }} />
                                    )}
                                  </Tooltip>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={account.isActive ? 'Active' : 'Inactive'}
                                size="small"
                                color={account.isActive ? 'success' : 'error'}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                onClick={(e) => handleMenuOpen(e, account)}
                                size="small"
                              >
                                <MoreVert />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box>
                {/* Tree view implementation would go here */}
                <Alert severity="info">
                  Tree view is under development. Please use table view for now.
                </Alert>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleViewAccount}>
            <Visibility sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          <PermissionGuard module="accounting" action="update" showFallback={false}>
            <MenuItem onClick={handleEditAccount}>
              <Edit sx={{ mr: 1 }} />
              Edit Account
            </MenuItem>
          </PermissionGuard>
          <PermissionGuard module="accounting" action="delete" showFallback={false}>
            <MenuItem onClick={handleDeleteAccount} sx={{ color: 'error.main' }}>
              <Delete sx={{ mr: 1 }} />
              Delete Account
            </MenuItem>
          </PermissionGuard>
        </Menu>

        {/* Create/Edit Account Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {dialogMode === 'create' ? 'Add New Account' : 
             dialogMode === 'edit' ? 'Edit Account' : 'Account Details'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Account Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                disabled={dialogMode === 'view'}
              />
              <TextField
                fullWidth
                label="Account Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={dialogMode === 'view'}
              />
              <FormControl fullWidth disabled={dialogMode === 'view'}>
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Account Type"
                  onChange={(e) => {
                    const newType = e.target.value as AccountType
                    const subTypeOptions = getSubTypeOptions(newType)
                    setFormData({ 
                      ...formData, 
                      type: newType,
                      subType: subTypeOptions[0] || AccountSubType.CURRENT_ASSET
                    })
                  }}
                >
                  {Object.values(AccountType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {getAccountTypeDisplayName(type)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth disabled={dialogMode === 'view'}>
                <InputLabel>Sub Type</InputLabel>
                <Select
                  value={formData.subType}
                  label="Sub Type"
                  onChange={(e) => setFormData({ ...formData, subType: e.target.value as AccountSubType })}
                >
                  {getSubTypeOptions(formData.type).map((subType) => (
                    <MenuItem key={subType} value={subType}>
                      {getAccountSubTypeDisplayName(subType)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={dialogMode === 'view'}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              {dialogMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {dialogMode !== 'view' && (
              <Button 
                onClick={handleSaveAccount}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                  }
                }}
              >
                {dialogMode === 'create' ? 'Create Account' : 'Save Changes'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </PermissionGuard>
  )
}

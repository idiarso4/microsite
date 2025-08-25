import React, { useState, useEffect } from 'react'
import {
  TextField,
  MenuItem,
  Grid,
  Box,
  Chip,
  InputAdornment,
  Alert,
  Switch,
  FormControlLabel,
  Autocomplete,
  Typography
} from '@mui/material'
import {
  AccountBalance,
  Category,
  Description,
  Numbers,
  TaxiAlert
} from '@mui/icons-material'
import { FormModal, FormField, FormSection, FormGrid } from '../common'

export interface AccountFormData {
  id?: number
  code: string
  name: string
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  subType?: string
  description?: string
  parentId?: number
  parentName?: string
  isActive?: boolean
  isTaxAccount?: boolean
  taxRate?: number
  balance?: number
  currency?: string
}

export interface AccountFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AccountFormData) => Promise<void>
  initialData?: Partial<AccountFormData>
  loading?: boolean
  mode?: 'create' | 'edit'
  parentAccounts?: Array<{ id: number; name: string; code: string }>
}

const accountTypes = [
  { value: 'asset', label: 'Asset', color: '#4caf50' },
  { value: 'liability', label: 'Liability', color: '#f44336' },
  { value: 'equity', label: 'Equity', color: '#2196f3' },
  { value: 'revenue', label: 'Revenue', color: '#ff9800' },
  { value: 'expense', label: 'Expense', color: '#9c27b0' }
]

const subTypes = {
  asset: ['Current Asset', 'Fixed Asset', 'Intangible Asset', 'Investment'],
  liability: ['Current Liability', 'Long-term Liability', 'Contingent Liability'],
  equity: ['Share Capital', 'Retained Earnings', 'Other Equity'],
  revenue: ['Operating Revenue', 'Non-operating Revenue', 'Other Income'],
  expense: ['Operating Expense', 'Non-operating Expense', 'Cost of Goods Sold']
}

const currencies = ['IDR', 'USD', 'EUR', 'SGD', 'MYR']

export default function AccountForm({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  mode = 'create',
  parentAccounts = []
}: AccountFormProps) {
  const [formData, setFormData] = useState<AccountFormData>({
    code: '',
    name: '',
    type: 'asset',
    subType: '',
    description: '',
    parentId: undefined,
    parentName: '',
    isActive: true,
    isTaxAccount: false,
    taxRate: 0,
    balance: 0,
    currency: 'IDR',
    ...initialData
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  useEffect(() => {
    // Auto-generate account code if not provided
    if (mode === 'create' && formData.type && !formData.code) {
      const typePrefix = {
        asset: '1',
        liability: '2',
        equity: '3',
        revenue: '4',
        expense: '5'
      }
      const prefix = typePrefix[formData.type]
      const code = prefix + '000' + Date.now().toString().slice(-3)
      setFormData(prev => ({ ...prev, code }))
    }
  }, [formData.type, mode])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.code.trim()) {
      newErrors.code = 'Account code is required'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Account name is required'
    }

    if (!formData.type) {
      newErrors.type = 'Account type is required'
    }

    if (formData.isTaxAccount && (!formData.taxRate || formData.taxRate < 0 || formData.taxRate > 100)) {
      newErrors.taxRate = 'Tax rate must be between 0 and 100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      await onSubmit(formData)
      handleClose()
    } catch (error) {
      console.error('Failed to submit account:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      code: '',
      name: '',
      type: 'asset',
      subType: '',
      description: '',
      parentId: undefined,
      parentName: '',
      isActive: true,
      isTaxAccount: false,
      taxRate: 0,
      balance: 0,
      currency: 'IDR'
    })
    setErrors({})
    onClose()
  }

  const handleChange = (field: keyof AccountFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.type === 'number' 
      ? parseFloat(event.target.value) || 0 
      : event.target.value
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Reset subType when type changes
    if (field === 'type') {
      setFormData(prev => ({ ...prev, subType: '' }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleParentChange = (_event: any, newValue: any) => {
    setFormData(prev => ({
      ...prev,
      parentId: newValue?.id,
      parentName: newValue?.name || ''
    }))
  }

  const selectedAccountType = accountTypes.find(t => t.value === formData.type)
  const availableSubTypes = subTypes[formData.type as keyof typeof subTypes] || []

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={mode === 'create' ? 'Add New Account' : 'Edit Account'}
      subtitle={mode === 'create' ? 'Create a new chart of account' : 'Update account information'}
      loading={loading}
      maxWidth="md"
    >
      <Box sx={{ minHeight: 500 }}>
        <FormSection title="Account Information" subtitle="Basic account details">
          <FormGrid columns={2}>
            <FormField label="Account Code" required error={errors.code}>
              <TextField
                fullWidth
                value={formData.code}
                onChange={handleChange('code')}
                placeholder="1001"
                error={!!errors.code}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Numbers />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Account Name" required error={errors.name}>
              <TextField
                fullWidth
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="Enter account name"
                error={!!errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalance />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Account Type" required error={errors.type}>
              <TextField
                select
                fullWidth
                value={formData.type}
                onChange={handleChange('type')}
                error={!!errors.type}
              >
                {accountTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: type.color
                        }}
                      />
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </FormField>

            <FormField label="Sub Type">
              <TextField
                select
                fullWidth
                value={formData.subType}
                onChange={handleChange('subType')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Category />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">
                  <em>Select sub type</em>
                </MenuItem>
                {availableSubTypes.map((subType) => (
                  <MenuItem key={subType} value={subType}>
                    {subType}
                  </MenuItem>
                ))}
              </TextField>
            </FormField>

            <FormField label="Parent Account">
              <Autocomplete
                options={parentAccounts.filter(acc => acc.id !== formData.id)}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                value={parentAccounts.find(p => p.id === formData.parentId) || null}
                onChange={handleParentChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select parent account"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountBalance />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </FormField>

            <FormField label="Currency">
              <TextField
                select
                fullWidth
                value={formData.currency}
                onChange={handleChange('currency')}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </TextField>
            </FormField>
          </FormGrid>

          <FormField label="Description">
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Enter account description..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <Description />
                  </InputAdornment>
                ),
              }}
            />
          </FormField>
        </FormSection>

        <FormSection title="Tax & Settings" subtitle="Tax configuration and account settings">
          <FormGrid columns={2}>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleChange('isActive')}
                    color="primary"
                  />
                }
                label="Active Account"
              />
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isTaxAccount}
                    onChange={handleChange('isTaxAccount')}
                    color="primary"
                  />
                }
                label="Tax Account"
              />
            </Box>

            {formData.isTaxAccount && (
              <FormField label="Tax Rate (%)" error={errors.taxRate}>
                <TextField
                  fullWidth
                  type="number"
                  value={formData.taxRate}
                  onChange={handleChange('taxRate')}
                  placeholder="11"
                  error={!!errors.taxRate}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TaxiAlert />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormField>
            )}

            {mode === 'edit' && (
              <FormField label="Current Balance">
                <TextField
                  fullWidth
                  type="number"
                  value={formData.balance}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {formData.currency}
                      </InputAdornment>
                    ),
                  }}
                />
              </FormField>
            )}
          </FormGrid>
        </FormSection>

        {selectedAccountType && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Account Type:</strong> {selectedAccountType.label}
              <br />
              This account will be classified under {selectedAccountType.label.toLowerCase()} in the chart of accounts.
            </Typography>
          </Alert>
        )}

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Please fix the errors above before submitting.
          </Alert>
        )}
      </Box>
    </FormModal>
  )
}

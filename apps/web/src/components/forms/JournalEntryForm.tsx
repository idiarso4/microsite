import React, { useState, useEffect } from 'react'
import {
  TextField,
  MenuItem,
  Grid,
  Box,
  Chip,
  InputAdornment,
  Alert,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Autocomplete
} from '@mui/material'
import {
  Receipt,
  CalendarToday,
  Description,
  AttachMoney,
  Add,
  Delete,
  AccountBalance
} from '@mui/icons-material'
import { FormModal, FormField, FormSection, FormGrid } from '../common'

export interface JournalLineItem {
  id?: number
  accountId: number
  accountName?: string
  accountCode?: string
  description: string
  debit: number
  credit: number
}

export interface JournalEntryFormData {
  id?: number
  entryNumber: string
  date: string
  reference?: string
  description: string
  totalDebit: number
  totalCredit: number
  status: 'draft' | 'posted' | 'reversed'
  lineItems: JournalLineItem[]
  notes?: string
}

export interface JournalEntryFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: JournalEntryFormData) => Promise<void>
  initialData?: Partial<JournalEntryFormData>
  loading?: boolean
  mode?: 'create' | 'edit'
  accounts?: Array<{ id: number; name: string; code: string; type: string }>
}

const statusOptions = [
  { value: 'draft', label: 'Draft', color: 'default' },
  { value: 'posted', label: 'Posted', color: 'success' },
  { value: 'reversed', label: 'Reversed', color: 'error' }
]

export default function JournalEntryForm({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  mode = 'create',
  accounts = []
}: JournalEntryFormProps) {
  const [formData, setFormData] = useState<JournalEntryFormData>({
    entryNumber: '',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    description: '',
    totalDebit: 0,
    totalCredit: 0,
    status: 'draft',
    lineItems: [
      { accountId: 0, description: '', debit: 0, credit: 0 },
      { accountId: 0, description: '', debit: 0, credit: 0 }
    ],
    notes: '',
    ...initialData
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  useEffect(() => {
    // Auto-generate entry number if not provided
    if (mode === 'create' && !formData.entryNumber) {
      const entryNumber = 'JE' + new Date().getFullYear() + '-' + Date.now().toString().slice(-6)
      setFormData(prev => ({ ...prev, entryNumber }))
    }
  }, [mode])

  useEffect(() => {
    // Calculate totals
    const totalDebit = formData.lineItems.reduce((sum, item) => sum + (item.debit || 0), 0)
    const totalCredit = formData.lineItems.reduce((sum, item) => sum + (item.credit || 0), 0)
    
    setFormData(prev => ({
      ...prev,
      totalDebit,
      totalCredit
    }))
  }, [formData.lineItems])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.entryNumber.trim()) {
      newErrors.entryNumber = 'Entry number is required'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    // Validate line items
    const validLineItems = formData.lineItems.filter(item => 
      item.accountId && (item.debit > 0 || item.credit > 0)
    )

    if (validLineItems.length < 2) {
      newErrors.lineItems = 'At least 2 line items are required'
    }

    // Check if debits equal credits
    if (Math.abs(formData.totalDebit - formData.totalCredit) > 0.01) {
      newErrors.balance = 'Total debits must equal total credits'
    }

    // Validate each line item
    formData.lineItems.forEach((item, index) => {
      if (item.accountId && (item.debit > 0 || item.credit > 0)) {
        if (!item.description.trim()) {
          newErrors[`lineItem_${index}_description`] = 'Line item description is required'
        }
        if (item.debit > 0 && item.credit > 0) {
          newErrors[`lineItem_${index}_amount`] = 'Line item cannot have both debit and credit'
        }
        if (item.debit === 0 && item.credit === 0) {
          newErrors[`lineItem_${index}_amount`] = 'Line item must have either debit or credit amount'
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      // Filter out empty line items
      const validLineItems = formData.lineItems.filter(item => 
        item.accountId && (item.debit > 0 || item.credit > 0)
      )

      await onSubmit({
        ...formData,
        lineItems: validLineItems
      })
      handleClose()
    } catch (error) {
      console.error('Failed to submit journal entry:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      entryNumber: '',
      date: new Date().toISOString().split('T')[0],
      reference: '',
      description: '',
      totalDebit: 0,
      totalCredit: 0,
      status: 'draft',
      lineItems: [
        { accountId: 0, description: '', debit: 0, credit: 0 },
        { accountId: 0, description: '', debit: 0, credit: 0 }
      ],
      notes: ''
    })
    setErrors({})
    onClose()
  }

  const handleChange = (field: keyof JournalEntryFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleLineItemChange = (index: number, field: keyof JournalLineItem, value: any) => {
    const newLineItems = [...formData.lineItems]
    newLineItems[index] = {
      ...newLineItems[index],
      [field]: value
    }

    // If account is selected, populate account details
    if (field === 'accountId' && value) {
      const account = accounts.find(acc => acc.id === value)
      if (account) {
        newLineItems[index].accountName = account.name
        newLineItems[index].accountCode = account.code
      }
    }

    // Clear opposite amount when entering debit/credit
    if (field === 'debit' && value > 0) {
      newLineItems[index].credit = 0
    } else if (field === 'credit' && value > 0) {
      newLineItems[index].debit = 0
    }

    setFormData(prev => ({
      ...prev,
      lineItems: newLineItems
    }))

    // Clear related errors
    const errorKey = `lineItem_${index}_${field}`
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }))
    }
  }

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { accountId: 0, description: '', debit: 0, credit: 0 }
      ]
    }))
  }

  const removeLineItem = (index: number) => {
    if (formData.lineItems.length > 2) {
      const newLineItems = formData.lineItems.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        lineItems: newLineItems
      }))
    }
  }

  const isBalanced = Math.abs(formData.totalDebit - formData.totalCredit) < 0.01
  const canPost = mode === 'create' || formData.status === 'draft'

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={mode === 'create' ? 'Create Journal Entry' : 'Edit Journal Entry'}
      subtitle={mode === 'create' ? 'Create a new journal entry' : 'Update journal entry details'}
      loading={loading}
      maxWidth="lg"
    >
      <Box sx={{ minHeight: 600 }}>
        <FormSection title="Journal Entry Header" subtitle="Basic entry information">
          <FormGrid columns={3}>
            <FormField label="Entry Number" required error={errors.entryNumber}>
              <TextField
                fullWidth
                value={formData.entryNumber}
                onChange={handleChange('entryNumber')}
                placeholder="JE2024-001"
                error={!!errors.entryNumber}
                disabled={mode === 'edit'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Receipt />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Date" required error={errors.date}>
              <TextField
                fullWidth
                type="date"
                value={formData.date}
                onChange={handleChange('date')}
                error={!!errors.date}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Reference">
              <TextField
                fullWidth
                value={formData.reference}
                onChange={handleChange('reference')}
                placeholder="Reference number"
              />
            </FormField>
          </FormGrid>

          <FormField label="Description" required error={errors.description}>
            <TextField
              fullWidth
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Enter journal entry description"
              error={!!errors.description}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description />
                  </InputAdornment>
                ),
              }}
            />
          </FormField>

          {mode === 'edit' && (
            <FormField label="Status">
              <TextField
                select
                fullWidth
                value={formData.status}
                onChange={handleChange('status')}
                disabled={!canPost}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    <Chip
                      size="small"
                      label={status.label}
                      color={status.color as any}
                    />
                  </MenuItem>
                ))}
              </TextField>
            </FormField>
          )}
        </FormSection>

        <FormSection title="Journal Entry Lines" subtitle="Debit and credit entries">
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Line Items</Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={addLineItem}
              size="small"
            >
              Add Line
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Account</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Debit</TableCell>
                  <TableCell align="right">Credit</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.lineItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ minWidth: 200 }}>
                      <Autocomplete
                        size="small"
                        options={accounts}
                        getOptionLabel={(option) => `${option.code} - ${option.name}`}
                        value={accounts.find(acc => acc.id === item.accountId) || null}
                        onChange={(event, newValue) => 
                          handleLineItemChange(index, 'accountId', newValue?.id || 0)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select account"
                            error={!!errors[`lineItem_${index}_account`]}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 200 }}>
                      <TextField
                        size="small"
                        fullWidth
                        value={item.description}
                        onChange={(e) => 
                          handleLineItemChange(index, 'description', e.target.value)
                        }
                        placeholder="Line description"
                        error={!!errors[`lineItem_${index}_description`]}
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <TextField
                        size="small"
                        type="number"
                        value={item.debit || ''}
                        onChange={(e) => 
                          handleLineItemChange(index, 'debit', parseFloat(e.target.value) || 0)
                        }
                        placeholder="0.00"
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <TextField
                        size="small"
                        type="number"
                        value={item.credit || ''}
                        onChange={(e) => 
                          handleLineItemChange(index, 'credit', parseFloat(e.target.value) || 0)
                        }
                        placeholder="0.00"
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => removeLineItem(index)}
                        disabled={formData.lineItems.length <= 2}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                    TOTALS
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {formData.totalDebit.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {formData.totalCredit.toFixed(2)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {errors.lineItems && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.lineItems}
            </Alert>
          )}

          {errors.balance && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.balance}
            </Alert>
          )}

          {!isBalanced && formData.totalDebit > 0 && formData.totalCredit > 0 && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Entry is not balanced. Difference: {Math.abs(formData.totalDebit - formData.totalCredit).toFixed(2)}
            </Alert>
          )}

          {isBalanced && formData.totalDebit > 0 && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Entry is balanced ✓
            </Alert>
          )}
        </FormSection>

        <FormSection title="Additional Information" subtitle="Notes and comments">
          <FormField label="Notes">
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange('notes')}
              placeholder="Enter any additional notes..."
            />
          </FormField>
        </FormSection>

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Please fix the errors above before submitting.
          </Alert>
        )}
      </Box>
    </FormModal>
  )
}

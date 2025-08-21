import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  InputAdornment,
  CircularProgress,
  Alert,
  MenuItem
} from '@mui/material'
import {
  AttachMoney,
  Description,
  Person,
  Numbers,
  Category
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import FormTextField from './FormTextField'
import FormSelect from './FormSelect'
import { apiService } from '../../services/api'

// Transaction validation schema
const transactionSchema = yup.object({
  type: yup.string().required('Type wajib dipilih'),
  description: yup.string().required('Description wajib diisi'),
  amount: yup.number().positive('Amount harus lebih dari 0').required('Amount wajib diisi'),
  customerId: yup.number().positive('Customer wajib dipilih').required('Customer wajib dipilih'),
  category: yup.string().optional(),
  reference: yup.string().optional()
})

export type TransactionFormData = yup.InferType<typeof transactionSchema>

interface TransactionFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TransactionFormData) => Promise<void>
  initialData?: Partial<TransactionFormData>
  title?: string
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title = 'Add New Transaction'
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [customers, setCustomers] = useState<any[]>([])

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<TransactionFormData>({
    resolver: yupResolver(transactionSchema),
    defaultValues: {
      type: initialData?.type || 'income',
      description: initialData?.description || '',
      amount: initialData?.amount || 0,
      customerId: initialData?.customerId || 1,
      category: initialData?.category || '',
      reference: initialData?.reference || `TXN-${Date.now()}`
    }
  })

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await apiService.getCustomers()
        setCustomers(data.customers || [])
      } catch (error) {
        console.error('Failed to fetch customers:', error)
        // Fallback to mock data if API fails
        setCustomers([
          { id: 1, name: 'Budi Santoso', company: 'PT Teknologi Maju' },
          { id: 2, name: 'Siti Nurhaliza', company: 'CV Berkah Jaya' },
          { id: 3, name: 'Ahmad Rahman', company: 'PT Solusi Digital' }
        ])
      }
    }

    if (open) {
      fetchCustomers()
    }
  }, [open])

  const customerOptions = customers.map(customer => ({
    value: customer.id,
    label: `${customer.name} - ${customer.company}`
  }))

  const typeOptions = [
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' }
  ]

  const categoryOptions = [
    { value: 'sales', label: 'Sales' },
    { value: 'service', label: 'Service' },
    { value: 'office', label: 'Office Expense' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'travel', label: 'Travel' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'other', label: 'Other' }
  ]

  const handleFormSubmit = async (data: TransactionFormData) => {
    setLoading(true)
    setError('')

    try {
      await onSubmit(data)
      reset()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan transaction')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setError('')
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 2, 
        borderBottom: '1px solid #e0e0e0',
        background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
        color: 'white'
      }}>
        {title}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormSelect
              name="type"
              control={control}
              label="Transaction Type"
              options={typeOptions}
              placeholder="Pilih type"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="amount"
              control={control}
              label="Amount (Rp)"
              type="number"
              placeholder="1000000"
              startAdornment={
                <InputAdornment position="start">
                  <AttachMoney sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12}>
            <FormTextField
              name="description"
              control={control}
              label="Description"
              placeholder="Payment for services, Office supplies, etc."
              multiline
              rows={3}
              startAdornment={
                <InputAdornment position="start">
                  <Description sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormSelect
              name="customerId"
              control={control}
              label="Customer/Vendor"
              options={customerOptions}
              placeholder="Pilih customer"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormSelect
              name="category"
              control={control}
              label="Category"
              options={categoryOptions}
              placeholder="Pilih category"
            />
          </Grid>

          <Grid item xs={12}>
            <FormTextField
              name="reference"
              control={control}
              label="Reference Number"
              placeholder="TXN-2024-001"
              startAdornment={
                <InputAdornment position="start">
                  <Numbers sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ 
            borderColor: '#DC143C',
            color: '#DC143C',
            '&:hover': {
              borderColor: '#B91C3C',
              backgroundColor: 'rgba(220, 20, 60, 0.04)'
            }
          }}
        >
          Batal
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={loading || isSubmitting}
          sx={{
            background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
            }
          }}
        >
          {(loading || isSubmitting) ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
              Menyimpan...
            </>
          ) : (
            'Simpan'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransactionForm

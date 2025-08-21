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
  ShoppingCart,
  AttachMoney,
  Person,
  Numbers,
  CalendarToday
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import FormTextField from './FormTextField'
import FormSelect from './FormSelect'
import { apiService } from '../../services/api'

// Order validation schema
const orderSchema = yup.object({
  orderNumber: yup.string().required('Order number wajib diisi'),
  customerId: yup.number().positive('Customer wajib dipilih').required('Customer wajib dipilih'),
  totalAmount: yup.number().positive('Total amount harus lebih dari 0').required('Total amount wajib diisi'),
  status: yup.string().required('Status wajib dipilih'),
  orderDate: yup.string().required('Order date wajib diisi')
})

export type OrderFormData = yup.InferType<typeof orderSchema>

interface OrderFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: OrderFormData) => Promise<void>
  initialData?: Partial<OrderFormData>
  title?: string
}

const OrderForm: React.FC<OrderFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title = 'Add New Order'
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [customers, setCustomers] = useState<any[]>([])

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<OrderFormData>({
    resolver: yupResolver(orderSchema),
    defaultValues: {
      orderNumber: initialData?.orderNumber || `ORD-${Date.now()}`,
      customerId: initialData?.customerId || 1,
      totalAmount: initialData?.totalAmount || 0,
      status: initialData?.status || 'pending',
      orderDate: initialData?.orderDate || new Date().toISOString().split('T')[0]
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

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const handleFormSubmit = async (data: OrderFormData) => {
    setLoading(true)
    setError('')

    try {
      await onSubmit(data)
      reset()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan order')
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
            <FormTextField
              name="orderNumber"
              control={control}
              label="Order Number"
              placeholder="ORD-2024-001"
              startAdornment={
                <InputAdornment position="start">
                  <Numbers sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormSelect
              name="customerId"
              control={control}
              label="Customer"
              options={customerOptions}
              placeholder="Pilih customer"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="totalAmount"
              control={control}
              label="Total Amount (Rp)"
              type="number"
              placeholder="1000000"
              startAdornment={
                <InputAdornment position="start">
                  <AttachMoney sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormSelect
              name="status"
              control={control}
              label="Status"
              options={statusOptions}
              placeholder="Pilih status"
            />
          </Grid>

          <Grid item xs={12}>
            <FormTextField
              name="orderDate"
              control={control}
              label="Order Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              startAdornment={
                <InputAdornment position="start">
                  <CalendarToday sx={{ color: '#DC143C' }} />
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

export default OrderForm

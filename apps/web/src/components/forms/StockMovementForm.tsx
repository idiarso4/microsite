import React, { useState, useEffect } from 'react'
import {
  TextField,
  MenuItem,
  Grid,
  Box,
  Chip,
  InputAdornment,
  Alert,
  Autocomplete,
  Typography
} from '@mui/material'
import {
  Inventory,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  Numbers,
  Notes,
  Person,
  CalendarToday
} from '@mui/icons-material'
import { FormModal, FormField, FormSection, FormGrid } from '../common'

export interface StockMovementFormData {
  id?: number
  productId: number
  productName?: string
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  reason?: string
  reference?: string
  notes?: string
  performedBy?: string
  date?: string
}

export interface StockMovementFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: StockMovementFormData) => Promise<void>
  initialData?: Partial<StockMovementFormData>
  loading?: boolean
  mode?: 'create' | 'edit'
  products?: Array<{ id: number; name: string; sku: string; stock: number }>
}

const movementTypes = [
  { 
    value: 'in', 
    label: 'Stock In', 
    icon: <TrendingUp />, 
    color: 'success',
    description: 'Add stock to inventory'
  },
  { 
    value: 'out', 
    label: 'Stock Out', 
    icon: <TrendingDown />, 
    color: 'error',
    description: 'Remove stock from inventory'
  },
  { 
    value: 'adjustment', 
    label: 'Adjustment', 
    icon: <SwapHoriz />, 
    color: 'warning',
    description: 'Adjust stock levels'
  }
]

const reasonOptions = {
  in: [
    'Purchase Order',
    'Return from Customer',
    'Production',
    'Transfer In',
    'Initial Stock',
    'Found Stock',
    'Other'
  ],
  out: [
    'Sale',
    'Return to Supplier',
    'Damaged',
    'Expired',
    'Transfer Out',
    'Lost',
    'Theft',
    'Other'
  ],
  adjustment: [
    'Physical Count',
    'System Error',
    'Damaged Goods',
    'Quality Issue',
    'Reconciliation',
    'Other'
  ]
}

export default function StockMovementForm({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  mode = 'create',
  products = []
}: StockMovementFormProps) {
  const [formData, setFormData] = useState<StockMovementFormData>({
    productId: 0,
    productName: '',
    type: 'in',
    quantity: 0,
    reason: '',
    reference: '',
    notes: '',
    performedBy: '',
    date: new Date().toISOString().split('T')[0],
    ...initialData
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  useEffect(() => {
    if (formData.productId) {
      const product = products.find(p => p.id === formData.productId)
      setSelectedProduct(product)
    }
  }, [formData.productId, products])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.productId) {
      newErrors.productId = 'Product is required'
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0'
    }

    if (formData.type === 'out' && selectedProduct && formData.quantity > selectedProduct.stock) {
      newErrors.quantity = `Cannot remove more than available stock (${selectedProduct.stock})`
    }

    if (!formData.reason) {
      newErrors.reason = 'Reason is required'
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
      console.error('Failed to submit stock movement:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      productId: 0,
      productName: '',
      type: 'in',
      quantity: 0,
      reason: '',
      reference: '',
      notes: '',
      performedBy: '',
      date: new Date().toISOString().split('T')[0]
    })
    setErrors({})
    setSelectedProduct(null)
    onClose()
  }

  const handleChange = (field: keyof StockMovementFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'number' 
      ? parseFloat(event.target.value) || 0 
      : event.target.value
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear reason when type changes
    if (field === 'type') {
      setFormData(prev => ({ ...prev, reason: '' }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleProductChange = (event: any, newValue: any) => {
    setFormData(prev => ({
      ...prev,
      productId: newValue?.id || 0,
      productName: newValue?.name || ''
    }))
    setSelectedProduct(newValue)
  }

  const selectedMovementType = movementTypes.find(t => t.value === formData.type)
  const availableReasons = reasonOptions[formData.type as keyof typeof reasonOptions] || []

  const getNewStockLevel = () => {
    if (!selectedProduct || !formData.quantity) return selectedProduct?.stock || 0
    
    switch (formData.type) {
      case 'in':
        return selectedProduct.stock + formData.quantity
      case 'out':
        return selectedProduct.stock - formData.quantity
      case 'adjustment':
        return formData.quantity
      default:
        return selectedProduct.stock
    }
  }

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={mode === 'create' ? 'Record Stock Movement' : 'Edit Stock Movement'}
      subtitle={mode === 'create' ? 'Add a new stock movement transaction' : 'Update stock movement details'}
      loading={loading}
      maxWidth="md"
    >
      <Box sx={{ minHeight: 500 }}>
        <FormSection title="Movement Details" subtitle="Product and movement type information">
          <FormGrid columns={2}>
            <FormField label="Product" required error={errors.productId}>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => `${option.name} (${option.sku})`}
                value={selectedProduct}
                onChange={handleProductChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select product"
                    error={!!errors.productId}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Inventory />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {option.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        SKU: {option.sku} | Stock: {option.stock}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </FormField>

            <FormField label="Movement Type" required>
              <TextField
                select
                fullWidth
                value={formData.type}
                onChange={handleChange('type')}
              >
                {movementTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {type.icon}
                      <Box>
                        <Typography variant="body2">{type.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {type.description}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </FormField>

            <FormField label="Quantity" required error={errors.quantity}>
              <TextField
                fullWidth
                type="number"
                value={formData.quantity}
                onChange={handleChange('quantity')}
                placeholder="0"
                error={!!errors.quantity}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Numbers />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Reason" required error={errors.reason}>
              <TextField
                select
                fullWidth
                value={formData.reason}
                onChange={handleChange('reason')}
                error={!!errors.reason}
              >
                <MenuItem value="">
                  <em>Select reason</em>
                </MenuItem>
                {availableReasons.map((reason) => (
                  <MenuItem key={reason} value={reason}>
                    {reason}
                  </MenuItem>
                ))}
              </TextField>
            </FormField>
          </FormGrid>

          {selectedProduct && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Current Stock:</strong> {selectedProduct.stock} units
                {formData.quantity > 0 && (
                  <>
                    <br />
                    <strong>New Stock Level:</strong> {getNewStockLevel()} units
                  </>
                )}
              </Typography>
            </Alert>
          )}
        </FormSection>

        <FormSection title="Additional Information" subtitle="Reference and tracking details">
          <FormGrid columns={2}>
            <FormField label="Reference Number">
              <TextField
                fullWidth
                value={formData.reference}
                onChange={handleChange('reference')}
                placeholder="PO-001, INV-123, etc."
              />
            </FormField>

            <FormField label="Date">
              <TextField
                fullWidth
                type="date"
                value={formData.date}
                onChange={handleChange('date')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Performed By">
              <TextField
                fullWidth
                value={formData.performedBy}
                onChange={handleChange('performedBy')}
                placeholder="Enter name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>
          </FormGrid>

          <FormField label="Notes">
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange('notes')}
              placeholder="Enter any additional notes..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <Notes />
                  </InputAdornment>
                ),
              }}
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

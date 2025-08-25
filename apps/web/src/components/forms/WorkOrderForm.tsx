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
  Assignment,
  CalendarToday,
  Inventory,
  Numbers,
  Person,
  Factory,
  Schedule
} from '@mui/icons-material'
import { FormModal, FormField, FormSection, FormGrid } from '../common'

export interface WorkOrderFormData {
  id?: number
  workOrderNumber: string
  productId: number
  productName?: string
  quantity: number
  startDate: string
  dueDate: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  assignedTo?: number
  assignedToName?: string
  workCenterId?: number
  workCenterName?: string
  notes?: string
  estimatedHours?: number
  actualHours?: number
}

export interface WorkOrderFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: WorkOrderFormData) => Promise<void>
  initialData?: Partial<WorkOrderFormData>
  loading?: boolean
  mode?: 'create' | 'edit'
  products?: Array<{ id: number; name: string; sku: string }>
  employees?: Array<{ id: number; name: string }>
  workCenters?: Array<{ id: number; name: string }>
}

const priorityOptions = [
  { value: 'low', label: 'Low', color: '#4caf50' },
  { value: 'medium', label: 'Medium', color: '#ff9800' },
  { value: 'high', label: 'High', color: '#f44336' },
  { value: 'urgent', label: 'Urgent', color: '#9c27b0' }
]

const statusOptions = [
  { value: 'planned', label: 'Planned', color: 'default' },
  { value: 'in_progress', label: 'In Progress', color: 'warning' },
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' }
]

export default function WorkOrderForm({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  mode = 'create',
  products = [],
  employees = [],
  workCenters = []
}: WorkOrderFormProps) {
  const [formData, setFormData] = useState<WorkOrderFormData>({
    workOrderNumber: '',
    productId: 0,
    productName: '',
    quantity: 1,
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    priority: 'medium',
    status: 'planned',
    assignedTo: undefined,
    assignedToName: '',
    workCenterId: undefined,
    workCenterName: '',
    notes: '',
    estimatedHours: 0,
    actualHours: 0,
    ...initialData
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  useEffect(() => {
    // Auto-generate work order number if not provided
    if (mode === 'create' && !formData.workOrderNumber) {
      const woNumber = 'WO' + new Date().getFullYear() + '-' + Date.now().toString().slice(-6)
      setFormData(prev => ({ ...prev, workOrderNumber: woNumber }))
    }
  }, [mode])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.workOrderNumber.trim()) {
      newErrors.workOrderNumber = 'Work order number is required'
    }

    if (!formData.productId) {
      newErrors.productId = 'Product is required'
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    }

    if (formData.startDate && formData.dueDate) {
      const start = new Date(formData.startDate)
      const due = new Date(formData.dueDate)
      if (due < start) {
        newErrors.dueDate = 'Due date must be after start date'
      }
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
      console.error('Failed to submit work order:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      workOrderNumber: '',
      productId: 0,
      productName: '',
      quantity: 1,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      priority: 'medium',
      status: 'planned',
      assignedTo: undefined,
      assignedToName: '',
      workCenterId: undefined,
      workCenterName: '',
      notes: '',
      estimatedHours: 0,
      actualHours: 0
    })
    setErrors({})
    onClose()
  }

  const handleChange = (field: keyof WorkOrderFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'number' 
      ? parseFloat(event.target.value) || 0 
      : event.target.value
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleProductChange = (_event: any, newValue: any) => {
    setFormData(prev => ({
      ...prev,
      productId: newValue?.id || 0,
      productName: newValue?.name || ''
    }))
  }

  const handleEmployeeChange = (_event: any, newValue: any) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: newValue?.id,
      assignedToName: newValue?.name || ''
    }))
  }

  const handleWorkCenterChange = (_event: any, newValue: any) => {
    setFormData(prev => ({
      ...prev,
      workCenterId: newValue?.id,
      workCenterName: newValue?.name || ''
    }))
  }

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={mode === 'create' ? 'Create Work Order' : 'Edit Work Order'}
      subtitle={mode === 'create' ? 'Create a new production work order' : 'Update work order details'}
      loading={loading}
      maxWidth="md"
    >
      <Box sx={{ minHeight: 500 }}>
        <FormSection title="Work Order Details" subtitle="Basic production information">
          <FormGrid columns={2}>
            <FormField label="Work Order Number" required error={errors.workOrderNumber}>
              <TextField
                fullWidth
                value={formData.workOrderNumber}
                onChange={handleChange('workOrderNumber')}
                placeholder="WO2024-001"
                error={!!errors.workOrderNumber}
                disabled={mode === 'edit'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Assignment />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Product" required error={errors.productId}>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => `${option.name} (${option.sku})`}
                value={products.find(p => p.id === formData.productId) || null}
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
              />
            </FormField>

            <FormField label="Quantity" required error={errors.quantity}>
              <TextField
                fullWidth
                type="number"
                value={formData.quantity}
                onChange={handleChange('quantity')}
                placeholder="1"
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

            <FormField label="Priority">
              <TextField
                select
                fullWidth
                value={formData.priority}
                onChange={handleChange('priority')}
              >
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: option.color
                        }}
                      />
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </FormField>

            <FormField label="Start Date" required error={errors.startDate}>
              <TextField
                fullWidth
                type="date"
                value={formData.startDate}
                onChange={handleChange('startDate')}
                error={!!errors.startDate}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Due Date" required error={errors.dueDate}>
              <TextField
                fullWidth
                type="date"
                value={formData.dueDate}
                onChange={handleChange('dueDate')}
                error={!!errors.dueDate}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>
          </FormGrid>
        </FormSection>

        <FormSection title="Assignment & Resources" subtitle="Work center and personnel assignment">
          <FormGrid columns={2}>
            <FormField label="Assigned To">
              <Autocomplete
                options={employees}
                getOptionLabel={(option) => option.name}
                value={employees.find(e => e.id === formData.assignedTo) || null}
                onChange={handleEmployeeChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select employee"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </FormField>

            <FormField label="Work Center">
              <Autocomplete
                options={workCenters}
                getOptionLabel={(option) => option.name}
                value={workCenters.find(w => w.id === formData.workCenterId) || null}
                onChange={handleWorkCenterChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select work center"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Factory />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </FormField>

            <FormField label="Estimated Hours">
              <TextField
                fullWidth
                type="number"
                value={formData.estimatedHours}
                onChange={handleChange('estimatedHours')}
                placeholder="0"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Schedule />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            {mode === 'edit' && (
              <FormField label="Actual Hours">
                <TextField
                  fullWidth
                  type="number"
                  value={formData.actualHours}
                  onChange={handleChange('actualHours')}
                  placeholder="0"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Schedule />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormField>
            )}

            {mode === 'edit' && (
              <FormField label="Status">
                <TextField
                  select
                  fullWidth
                  value={formData.status}
                  onChange={handleChange('status')}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Chip
                        size="small"
                        label={option.label}
                        color={option.color as any}
                      />
                    </MenuItem>
                  ))}
                </TextField>
              </FormField>
            )}
          </FormGrid>
        </FormSection>

        <FormSection title="Additional Information" subtitle="Notes and comments">
          <FormField label="Notes">
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange('notes')}
              placeholder="Enter any additional notes or instructions..."
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

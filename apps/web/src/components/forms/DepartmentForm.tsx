import React, { useState, useEffect } from 'react'
import {
  TextField,
  Grid,
  Box,
  InputAdornment,
  Alert,
  Switch,
  FormControlLabel,
  Avatar,
  Autocomplete
} from '@mui/material'
import {
  Business,
  Description,
  Person,
  LocationOn,
  AttachMoney
} from '@mui/icons-material'
import { FormModal, FormField, FormSection, FormGrid } from '../common'

export interface DepartmentFormData {
  id?: number
  name: string
  code: string
  description?: string
  managerId?: number
  managerName?: string
  location?: string
  budget?: number
  isActive?: boolean
  parentId?: number
  parentName?: string
}

export interface DepartmentFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: DepartmentFormData) => Promise<void>
  initialData?: Partial<DepartmentFormData>
  loading?: boolean
  mode?: 'create' | 'edit'
  managers?: Array<{ id: number; name: string }>
  parentDepartments?: Array<{ id: number; name: string }>
}

export default function DepartmentForm({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  mode = 'create',
  managers = [],
  parentDepartments = []
}: DepartmentFormProps) {
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: '',
    code: '',
    description: '',
    managerId: undefined,
    managerName: '',
    location: '',
    budget: 0,
    isActive: true,
    parentId: undefined,
    parentName: '',
    ...initialData
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  useEffect(() => {
    // Auto-generate department code if not provided
    if (mode === 'create' && formData.name && !formData.code) {
      const code = formData.name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 6)
      setFormData(prev => ({ ...prev, code }))
    }
  }, [formData.name, mode])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Department code is required'
    }

    if (formData.budget && formData.budget < 0) {
      newErrors.budget = 'Budget must be a positive number'
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
      console.error('Failed to submit department:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      managerId: undefined,
      managerName: '',
      location: '',
      budget: 0,
      isActive: true,
      parentId: undefined,
      parentName: ''
    })
    setErrors({})
    onClose()
  }

  const handleChange = (field: keyof DepartmentFormData) => (
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

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleManagerChange = (event: any, newValue: any) => {
    setFormData(prev => ({
      ...prev,
      managerId: newValue?.id,
      managerName: newValue?.name || ''
    }))
  }

  const handleParentChange = (event: any, newValue: any) => {
    setFormData(prev => ({
      ...prev,
      parentId: newValue?.id,
      parentName: newValue?.name || ''
    }))
  }

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={mode === 'create' ? 'Add New Department' : 'Edit Department'}
      subtitle={mode === 'create' ? 'Create a new department' : 'Update department information'}
      loading={loading}
      maxWidth="md"
    >
      <Box sx={{ minHeight: 400 }}>
        <FormSection title="Department Information" subtitle="Basic department details">
          <FormGrid columns={2}>
            <FormField label="Department Name" required error={errors.name}>
              <TextField
                fullWidth
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="Enter department name"
                error={!!errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Department Code" required error={errors.code}>
              <TextField
                fullWidth
                value={formData.code}
                onChange={handleChange('code')}
                placeholder="DEPT01"
                error={!!errors.code}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Department Manager">
              <Autocomplete
                options={managers}
                getOptionLabel={(option) => option.name}
                value={managers.find(m => m.id === formData.managerId) || null}
                onChange={handleManagerChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select manager"
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

            <FormField label="Parent Department">
              <Autocomplete
                options={parentDepartments}
                getOptionLabel={(option) => option.name}
                value={parentDepartments.find(p => p.id === formData.parentId) || null}
                onChange={handleParentChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select parent department"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </FormField>

            <FormField label="Location">
              <TextField
                fullWidth
                value={formData.location}
                onChange={handleChange('location')}
                placeholder="Enter department location"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Budget" error={errors.budget}>
              <TextField
                fullWidth
                type="number"
                value={formData.budget}
                onChange={handleChange('budget')}
                placeholder="0"
                error={!!errors.budget}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>
          </FormGrid>

          <FormField label="Description">
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Enter department description..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <Description />
                  </InputAdornment>
                ),
              }}
            />
          </FormField>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleChange('isActive')}
                color="primary"
              />
            }
            label="Active Department"
          />
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

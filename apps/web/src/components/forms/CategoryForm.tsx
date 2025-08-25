import React, { useState, useEffect } from 'react'
import {
  TextField,
  Grid,
  Box,
  InputAdornment,
  Alert,
  Switch,
  FormControlLabel,
  Avatar
} from '@mui/material'
import {
  Category,
  Description,
  ColorLens
} from '@mui/icons-material'
import { FormModal, FormField, FormSection, FormGrid } from '../common'

export interface CategoryFormData {
  id?: number
  name: string
  description?: string
  color?: string
  isActive?: boolean
  parentId?: number
  parentName?: string
}

export interface CategoryFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CategoryFormData) => Promise<void>
  initialData?: Partial<CategoryFormData>
  loading?: boolean
  mode?: 'create' | 'edit'
  parentCategories?: Array<{ id: number; name: string }>
}

const colorOptions = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
  '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
  '#ff5722', '#795548', '#9e9e9e', '#607d8b'
]

export default function CategoryForm({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  mode = 'create',
  parentCategories = []
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: '#2196f3',
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
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
      console.error('Failed to submit category:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      color: '#2196f3',
      isActive: true,
      parentId: undefined,
      parentName: ''
    })
    setErrors({})
    onClose()
  }

  const handleChange = (field: keyof CategoryFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={mode === 'create' ? 'Add New Category' : 'Edit Category'}
      subtitle={mode === 'create' ? 'Create a new product category' : 'Update category information'}
      loading={loading}
      maxWidth="sm"
    >
      <Box sx={{ minHeight: 300 }}>
        <FormSection title="Category Information" subtitle="Basic category details">
          <FormField label="Category Name" required error={errors.name}>
            <TextField
              fullWidth
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="Enter category name"
              error={!!errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Category />
                  </InputAdornment>
                ),
              }}
            />
          </FormField>

          <FormField label="Description">
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Enter category description..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <Description />
                  </InputAdornment>
                ),
              }}
            />
          </FormField>

          <FormField label="Category Color">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: formData.color,
                  width: 40,
                  height: 40
                }}
              >
                <Category />
              </Avatar>
              <TextField
                fullWidth
                value={formData.color}
                onChange={handleChange('color')}
                placeholder="#2196f3"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ColorLens />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {colorOptions.map((color) => (
                <Box
                  key={color}
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: color,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border: formData.color === color ? '2px solid #000' : '1px solid #ccc',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </Box>
          </FormField>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleChange('isActive')}
                color="primary"
              />
            }
            label="Active Category"
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

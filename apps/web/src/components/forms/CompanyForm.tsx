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
  FormControlLabel
} from '@mui/material'
import {
  Business,
  Language,
  Email,
  Phone,
  LocationOn,
  Category,
  People
} from '@mui/icons-material'
import { FormModal, FormField, FormSection, FormGrid } from '../common'

export interface CompanyFormData {
  id?: number
  name: string
  website?: string
  email?: string
  phone?: string
  address?: string
  industry?: string
  size?: string
  description?: string
  isActive?: boolean
  tags?: string[]
}

export interface CompanyFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CompanyFormData) => Promise<void>
  initialData?: Partial<CompanyFormData>
  loading?: boolean
  mode?: 'create' | 'edit'
}

const industryOptions = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Real Estate',
  'Consulting',
  'Media',
  'Transportation',
  'Energy',
  'Agriculture',
  'Other'
]

const sizeOptions = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees'
]

export default function CompanyForm({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  mode = 'create'
}: CompanyFormProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    industry: '',
    size: '',
    description: '',
    isActive: true,
    tags: [],
    ...initialData
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Please enter a valid website URL (include http:// or https://)'
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
      console.error('Failed to submit company:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      website: '',
      email: '',
      phone: '',
      address: '',
      industry: '',
      size: '',
      description: '',
      isActive: true,
      tags: []
    })
    setErrors({})
    setTagInput('')
    onClose()
  }

  const handleChange = (field: keyof CompanyFormData) => (
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

  const handleAddTag = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      event.preventDefault()
      const newTag = tagInput.trim()
      if (!formData.tags?.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), newTag]
        }))
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={mode === 'create' ? 'Add New Company' : 'Edit Company'}
      subtitle={mode === 'create' ? 'Create a new company record' : 'Update company information'}
      loading={loading}
      maxWidth="md"
    >
      <Box sx={{ minHeight: 500 }}>
        <FormSection title="Basic Information" subtitle="Company details and contact information">
          <FormGrid columns={2}>
            <FormField label="Company Name" required error={errors.name}>
              <TextField
                fullWidth
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="Enter company name"
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

            <FormField label="Website" error={errors.website}>
              <TextField
                fullWidth
                value={formData.website}
                onChange={handleChange('website')}
                placeholder="https://example.com"
                error={!!errors.website}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Language />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Email Address" error={errors.email}>
              <TextField
                fullWidth
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="contact@company.com"
                error={!!errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Phone Number" error={errors.phone}>
              <TextField
                fullWidth
                value={formData.phone}
                onChange={handleChange('phone')}
                placeholder="Enter phone number"
                error={!!errors.phone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>
          </FormGrid>

          <FormField label="Address">
            <TextField
              fullWidth
              multiline
              rows={2}
              value={formData.address}
              onChange={handleChange('address')}
              placeholder="Enter company address"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />
          </FormField>
        </FormSection>

        <FormSection title="Company Details" subtitle="Industry and organizational information">
          <FormGrid columns={2}>
            <FormField label="Industry">
              <TextField
                select
                fullWidth
                value={formData.industry}
                onChange={handleChange('industry')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Category />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">
                  <em>Select industry</em>
                </MenuItem>
                {industryOptions.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </TextField>
            </FormField>

            <FormField label="Company Size">
              <TextField
                select
                fullWidth
                value={formData.size}
                onChange={handleChange('size')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <People />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">
                  <em>Select size</em>
                </MenuItem>
                {sizeOptions.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
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
              placeholder="Enter company description..."
            />
          </FormField>

          <FormField label="Tags">
            <TextField
              fullWidth
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter"
              helperText="Press Enter to add tags"
            />
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.tags?.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                  color="primary"
                  variant="outlined"
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
            label="Active Company"
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

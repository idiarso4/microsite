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
  Typography
} from '@mui/material'
import {
  Business,
  Email,
  Phone,
  LocationOn,
  Language,
  Category,
  AttachMoney,
  Star
} from '@mui/icons-material'
import { FormModal, FormField, FormSection, FormGrid } from '../common'

export interface VendorFormData {
  id?: number
  name: string
  code: string
  email?: string
  phone?: string
  address?: string
  website?: string
  contactPerson?: string
  category?: string
  paymentTerms?: string
  creditLimit?: number
  taxId?: string
  rating?: number
  status: 'active' | 'inactive' | 'blacklisted'
  notes?: string
  tags?: string[]
}

export interface VendorFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: VendorFormData) => Promise<void>
  initialData?: Partial<VendorFormData>
  loading?: boolean
  mode?: 'create' | 'edit'
}

const statusOptions = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'warning' },
  { value: 'blacklisted', label: 'Blacklisted', color: 'error' }
]

const categoryOptions = [
  'Raw Materials', 'Office Supplies', 'Equipment', 'Services', 
  'Software', 'Maintenance', 'Consulting', 'Transportation', 'Other'
]

const paymentTermsOptions = [
  'Net 30', 'Net 60', 'Net 90', 'COD', '2/10 Net 30', 'Prepaid', 'Custom'
]

export default function VendorForm({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  mode = 'create'
}: VendorFormProps) {
  const [formData, setFormData] = useState<VendorFormData>({
    name: '',
    code: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    contactPerson: '',
    category: '',
    paymentTerms: 'Net 30',
    creditLimit: 0,
    taxId: '',
    rating: 5,
    status: 'active',
    notes: '',
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

  useEffect(() => {
    // Auto-generate vendor code if not provided
    if (mode === 'create' && formData.name && !formData.code) {
      const code = 'VEN' + formData.name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 6) + Date.now().toString().slice(-3)
      setFormData(prev => ({ ...prev, code }))
    }
  }, [formData.name, mode])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Vendor name is required'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Vendor code is required'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Please enter a valid website URL (include http:// or https://)'
    }

    if (formData.creditLimit && formData.creditLimit < 0) {
      newErrors.creditLimit = 'Credit limit must be a positive number'
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
      console.error('Failed to submit vendor:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      code: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      contactPerson: '',
      category: '',
      paymentTerms: 'Net 30',
      creditLimit: 0,
      taxId: '',
      rating: 5,
      status: 'active',
      notes: '',
      tags: []
    })
    setErrors({})
    setTagInput('')
    onClose()
  }

  const handleChange = (field: keyof VendorFormData) => (
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
      title={mode === 'create' ? 'Add New Vendor' : 'Edit Vendor'}
      subtitle={mode === 'create' ? 'Create a new vendor record' : 'Update vendor information'}
      loading={loading}
      maxWidth="lg"
    >
      <Box sx={{ minHeight: 600 }}>
        <FormSection title="Basic Information" subtitle="Vendor identification and contact details">
          <FormGrid columns={2}>
            <FormField label="Vendor Name" required error={errors.name}>
              <TextField
                fullWidth
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="Enter vendor name"
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

            <FormField label="Vendor Code" required error={errors.code}>
              <TextField
                fullWidth
                value={formData.code}
                onChange={handleChange('code')}
                placeholder="VEN001"
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

            <FormField label="Email Address" error={errors.email}>
              <TextField
                fullWidth
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="vendor@company.com"
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

            <FormField label="Contact Person">
              <TextField
                fullWidth
                value={formData.contactPerson}
                onChange={handleChange('contactPerson')}
                placeholder="Enter contact person name"
              />
            </FormField>

            <FormField label="Website" error={errors.website}>
              <TextField
                fullWidth
                value={formData.website}
                onChange={handleChange('website')}
                placeholder="https://vendor-website.com"
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
          </FormGrid>

          <FormField label="Address">
            <TextField
              fullWidth
              multiline
              rows={2}
              value={formData.address}
              onChange={handleChange('address')}
              placeholder="Enter vendor address"
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

        <FormSection title="Business Details" subtitle="Category, terms, and financial information">
          <FormGrid columns={2}>
            <FormField label="Category">
              <TextField
                select
                fullWidth
                value={formData.category}
                onChange={handleChange('category')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Category />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">
                  <em>Select category</em>
                </MenuItem>
                {categoryOptions.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </FormField>

            <FormField label="Payment Terms">
              <TextField
                select
                fullWidth
                value={formData.paymentTerms}
                onChange={handleChange('paymentTerms')}
              >
                {paymentTermsOptions.map((term) => (
                  <MenuItem key={term} value={term}>
                    {term}
                  </MenuItem>
                ))}
              </TextField>
            </FormField>

            <FormField label="Credit Limit" error={errors.creditLimit}>
              <TextField
                fullWidth
                type="number"
                value={formData.creditLimit}
                onChange={handleChange('creditLimit')}
                placeholder="0"
                error={!!errors.creditLimit}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Tax ID">
              <TextField
                fullWidth
                value={formData.taxId}
                onChange={handleChange('taxId')}
                placeholder="Enter tax identification number"
              />
            </FormField>

            <FormField label="Rating">
              <TextField
                select
                fullWidth
                value={formData.rating}
                onChange={handleChange('rating')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Star />
                    </InputAdornment>
                  ),
                }}
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <MenuItem key={rating} value={rating}>
                    {rating} Star{rating > 1 ? 's' : ''}
                  </MenuItem>
                ))}
              </TextField>
            </FormField>

            <FormField label="Status" required>
              <TextField
                select
                fullWidth
                value={formData.status}
                onChange={handleChange('status')}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        label={option.label}
                        color={option.color as any}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </FormField>
          </FormGrid>
        </FormSection>

        <FormSection title="Additional Information" subtitle="Notes and tags">
          <FormField label="Notes">
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange('notes')}
              placeholder="Enter any additional notes about this vendor..."
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

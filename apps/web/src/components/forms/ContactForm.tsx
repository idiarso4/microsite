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
  Autocomplete
} from '@mui/material'
import {
  Person,
  Email,
  Phone,
  Work,
  Business,
  Notes
} from '@mui/icons-material'
import { FormModal, FormField, FormSection, FormGrid } from '../common'

export interface ContactFormData {
  id?: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  position?: string
  companyId?: number
  companyName?: string
  notes?: string
  isActive?: boolean
}

export interface ContactFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ContactFormData) => Promise<void>
  initialData?: Partial<ContactFormData>
  loading?: boolean
  mode?: 'create' | 'edit'
  companies?: Array<{ id: number; name: string }>
}

const positionOptions = [
  'CEO',
  'CTO',
  'CFO',
  'COO',
  'VP Sales',
  'VP Marketing',
  'Sales Manager',
  'Marketing Manager',
  'Account Manager',
  'Business Development',
  'Project Manager',
  'Developer',
  'Designer',
  'Consultant',
  'Director',
  'Manager',
  'Coordinator',
  'Specialist',
  'Analyst',
  'Other'
]

export default function ContactForm({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  mode = 'create',
  companies = []
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    companyId: undefined,
    companyName: '',
    notes: '',
    isActive: true,
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
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
      console.error('Failed to submit contact:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      companyId: undefined,
      companyName: '',
      notes: '',
      isActive: true
    })
    setErrors({})
    onClose()
  }

  const handleChange = (field: keyof ContactFormData) => (
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

  const handleCompanyChange = (event: any, newValue: any) => {
    setFormData(prev => ({
      ...prev,
      companyId: newValue?.id,
      companyName: newValue?.name || ''
    }))
  }

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={mode === 'create' ? 'Add New Contact' : 'Edit Contact'}
      subtitle={mode === 'create' ? 'Create a new contact record' : 'Update contact information'}
      loading={loading}
      maxWidth="md"
    >
      <Box sx={{ minHeight: 400 }}>
        <FormSection title="Personal Information" subtitle="Contact details and identification">
          <FormGrid columns={2}>
            <FormField label="First Name" required error={errors.firstName}>
              <TextField
                fullWidth
                value={formData.firstName}
                onChange={handleChange('firstName')}
                placeholder="Enter first name"
                error={!!errors.firstName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Last Name" required error={errors.lastName}>
              <TextField
                fullWidth
                value={formData.lastName}
                onChange={handleChange('lastName')}
                placeholder="Enter last name"
                error={!!errors.lastName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Email Address" required error={errors.email}>
              <TextField
                fullWidth
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="contact@example.com"
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
        </FormSection>

        <FormSection title="Professional Information" subtitle="Company and role details">
          <FormGrid columns={2}>
            <FormField label="Company">
              <Autocomplete
                options={companies}
                getOptionLabel={(option) => option.name}
                value={companies.find(c => c.id === formData.companyId) || null}
                onChange={handleCompanyChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select or search company"
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
                freeSolo
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Business sx={{ mr: 2, color: 'text.secondary' }} />
                    {option.name}
                  </Box>
                )}
              />
            </FormField>

            <FormField label="Position/Title">
              <TextField
                select
                fullWidth
                value={formData.position}
                onChange={handleChange('position')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Work />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">
                  <em>Select position</em>
                </MenuItem>
                {positionOptions.map((position) => (
                  <MenuItem key={position} value={position}>
                    {position}
                  </MenuItem>
                ))}
              </TextField>
            </FormField>
          </FormGrid>
        </FormSection>

        <FormSection title="Additional Information" subtitle="Notes and status">
          <FormField label="Notes">
            <TextField
              fullWidth
              multiline
              rows={4}
              value={formData.notes}
              onChange={handleChange('notes')}
              placeholder="Enter any additional notes about this contact..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <Notes />
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
            label="Active Contact"
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

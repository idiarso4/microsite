import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
  Fade,
  FormControl,
  FormLabel,
  FormHelperText,
  Divider,
  Chip
} from '@mui/material'
import { Close, Save, Cancel, Info, CheckCircle, Error as ErrorIcon } from '@mui/icons-material'
import { useFormValidation, ValidationRules } from '../../hooks/useFormValidation'

export interface FormField {
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'date' | 'datetime-local'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  multiline?: boolean
  rows?: number
  options?: Array<{ value: string | number; label: string }>
  helperText?: string
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  gridProps?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export interface EnhancedFormModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  fields: FormField[]
  initialValues?: { [key: string]: any }
  validationRules?: ValidationRules
  onSubmit: (values: { [key: string]: any }) => Promise<void> | void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  loading?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  showValidationSummary?: boolean
  autoFocus?: boolean
}

export default function EnhancedFormModal({
  open,
  onClose,
  title,
  subtitle,
  fields,
  initialValues = {},
  validationRules = {},
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  loading = false,
  maxWidth = 'sm',
  fullWidth = true,
  showValidationSummary = true,
  autoFocus = true
}: EnhancedFormModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFieldError
  } = useFormValidation(initialValues, validationRules)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      resetForm(initialValues)
      setSubmitError(null)
      setSubmitSuccess(false)
    }
  }, [open, initialValues, resetForm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setSubmitError('Please fix the validation errors before submitting.')
      return
    }

    try {
      setSubmitError(null)
      await onSubmit(values)
      setSubmitSuccess(true)
      
      // Close modal after short delay to show success
      setTimeout(() => {
        onClose()
        setSubmitSuccess(false)
      }, 1000)
    } catch (error: any) {
      console.error('Form submission error:', error)
      
      // Handle validation errors from server
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, message]) => {
          setFieldError(field, message as string)
        })
      } else {
        setSubmitError(error.message || 'An error occurred while saving. Please try again.')
      }
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      onClose()
    }
  }

  const renderField = (field: FormField) => {
    const fieldError = touched[field.name] ? errors[field.name] : undefined
    const hasError = Boolean(fieldError)

    const commonProps = {
      name: field.name,
      label: field.label,
      value: values[field.name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(field.name, e.target.value),
      onBlur: () => handleBlur(field.name),
      error: hasError,
      helperText: fieldError || field.helperText,
      disabled: field.disabled || loading,
      required: field.required,
      placeholder: field.placeholder,
      fullWidth: true,
      variant: 'outlined' as const,
      size: 'small' as const
    }

    if (field.type === 'textarea') {
      return (
        <TextField
          {...commonProps}
          multiline
          rows={field.rows || 4}
          InputProps={{
            startAdornment: field.startAdornment,
            endAdornment: field.endAdornment
          }}
        />
      )
    }

    if (field.type === 'select' && field.options) {
      return (
        <TextField
          {...commonProps}
          select
          SelectProps={{
            native: true
          }}
          InputProps={{
            startAdornment: field.startAdornment,
            endAdornment: field.endAdornment
          }}
        >
          <option value="">Select {field.label}</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      )
    }

    return (
      <TextField
        {...commonProps}
        type={field.type || 'text'}
        autoFocus={autoFocus && fields.indexOf(field) === 0}
        InputProps={{
          startAdornment: field.startAdornment,
          endAdornment: field.endAdornment
        }}
      />
    )
  }

  const errorCount = Object.keys(errors).length
  const touchedCount = Object.keys(touched).length

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <IconButton
            onClick={handleCancel}
            disabled={loading}
            sx={{ color: 'text.secondary' }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {/* Validation Summary */}
        {showValidationSummary && touchedCount > 0 && (
          <Fade in={errorCount > 0}>
            <Alert 
              severity="warning" 
              sx={{ mb: 3 }}
              icon={<ErrorIcon />}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">
                  Please fix {errorCount} validation error{errorCount !== 1 ? 's' : ''}
                </Typography>
                <Chip 
                  label={`${errorCount} error${errorCount !== 1 ? 's' : ''}`}
                  size="small"
                  color="warning"
                />
              </Box>
            </Alert>
          </Fade>
        )}

        {/* Submit Error */}
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircle />}>
            Successfully saved! Closing...
          </Alert>
        )}

        {/* Form Fields */}
        <Grid container spacing={3}>
          {fields.map((field) => (
            <Grid 
              item 
              xs={field.gridProps?.xs || 12}
              sm={field.gridProps?.sm || 6}
              md={field.gridProps?.md}
              lg={field.gridProps?.lg}
              xl={field.gridProps?.xl}
              key={field.name}
            >
              {renderField(field)}
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={handleCancel}
          disabled={loading}
          startIcon={<Cancel />}
          color="inherit"
        >
          {cancelLabel}
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading || submitSuccess}
          startIcon={loading ? <CircularProgress size={16} /> : <Save />}
          sx={{
            bgcolor: '#DC143C',
            '&:hover': { bgcolor: '#B91C3C' }
          }}
        >
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

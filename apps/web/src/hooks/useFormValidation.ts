import { useState, useCallback } from 'react'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  email?: boolean
  phone?: boolean
  url?: boolean
  custom?: (value: any) => string | null
  message?: string
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export interface ValidationErrors {
  [key: string]: string
}

export interface FormValidationResult {
  isValid: boolean
  errors: ValidationErrors
  touched: { [key: string]: boolean }
  values: { [key: string]: any }
  handleChange: (field: string, value: any) => void
  handleBlur: (field: string) => void
  validateField: (field: string, value?: any) => string | null
  validateForm: () => boolean
  resetForm: (initialValues?: { [key: string]: any }) => void
  setFieldError: (field: string, error: string) => void
  clearFieldError: (field: string) => void
  setValues: (values: { [key: string]: any }) => void
}

export function useFormValidation(
  initialValues: { [key: string]: any } = {},
  validationRules: ValidationRules = {}
): FormValidationResult {
  const [values, setValuesState] = useState(initialValues)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  const validateField = useCallback((field: string, value?: any): string | null => {
    const fieldValue = value !== undefined ? value : values[field]
    const rules = validationRules[field]
    
    if (!rules) return null

    // Required validation
    if (rules.required && (fieldValue === undefined || fieldValue === null || fieldValue === '')) {
      return rules.message || `${field} is required`
    }

    // Skip other validations if field is empty and not required
    if (!rules.required && (fieldValue === undefined || fieldValue === null || fieldValue === '')) {
      return null
    }

    // String validations
    if (typeof fieldValue === 'string') {
      // Min length
      if (rules.minLength && fieldValue.length < rules.minLength) {
        return rules.message || `${field} must be at least ${rules.minLength} characters`
      }

      // Max length
      if (rules.maxLength && fieldValue.length > rules.maxLength) {
        return rules.message || `${field} must be no more than ${rules.maxLength} characters`
      }

      // Email validation
      if (rules.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(fieldValue)) {
          return rules.message || 'Please enter a valid email address'
        }
      }

      // Phone validation (Indonesian format)
      if (rules.phone) {
        const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/
        if (!phoneRegex.test(fieldValue.replace(/[\s-]/g, ''))) {
          return rules.message || 'Please enter a valid phone number'
        }
      }

      // URL validation
      if (rules.url) {
        try {
          new URL(fieldValue)
        } catch {
          return rules.message || 'Please enter a valid URL'
        }
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(fieldValue)) {
        return rules.message || `${field} format is invalid`
      }
    }

    // Number validations
    if (typeof fieldValue === 'number' || !isNaN(Number(fieldValue))) {
      const numValue = Number(fieldValue)
      
      // Min value
      if (rules.min !== undefined && numValue < rules.min) {
        return rules.message || `${field} must be at least ${rules.min}`
      }

      // Max value
      if (rules.max !== undefined && numValue > rules.max) {
        return rules.message || `${field} must be no more than ${rules.max}`
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(fieldValue)
      if (customError) {
        return customError
      }
    }

    return null
  }, [values, validationRules])

  const handleChange = useCallback((field: string, value: any) => {
    setValuesState(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  const handleBlur = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    const error = validateField(field)
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }, [validateField])

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field)
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    setTouched(Object.keys(validationRules).reduce((acc, field) => {
      acc[field] = true
      return acc
    }, {} as { [key: string]: boolean }))

    return isValid
  }, [validationRules, validateField])

  const resetForm = useCallback((newInitialValues?: { [key: string]: any }) => {
    const resetValues = newInitialValues || initialValues
    setValuesState(resetValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [])

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const setValues = useCallback((newValues: { [key: string]: any }) => {
    setValuesState(newValues)
  }, [])

  const isValid = Object.keys(errors).length === 0

  return {
    isValid,
    errors,
    touched,
    values,
    handleChange,
    handleBlur,
    validateField,
    validateForm,
    resetForm,
    setFieldError,
    clearFieldError,
    setValues
  }
}

// Predefined validation rules for common fields
export const commonValidationRules = {
  email: {
    required: true,
    email: true,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character'
  },
  phone: {
    required: true,
    phone: true,
    message: 'Please enter a valid Indonesian phone number'
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Name must be 2-50 characters and contain only letters'
  },
  company: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Company name must be 2-100 characters'
  },
  price: {
    required: true,
    min: 0,
    message: 'Price must be a positive number'
  },
  quantity: {
    required: true,
    min: 1,
    message: 'Quantity must be at least 1'
  },
  percentage: {
    min: 0,
    max: 100,
    message: 'Percentage must be between 0 and 100'
  }
}

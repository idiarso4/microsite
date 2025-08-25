import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Divider,
  CircularProgress
} from '@mui/material'
import { Close, Save, Cancel } from '@mui/icons-material'

export interface FormModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  onSubmit?: () => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  loading?: boolean
  disabled?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  showActions?: boolean
  customActions?: React.ReactNode
}

export default function FormModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  loading = false,
  disabled = false,
  maxWidth = 'sm',
  fullWidth = true,
  showActions = true,
  customActions
}: FormModalProps) {
  const handleSubmit = () => {
    if (onSubmit && !loading && !disabled) {
      onSubmit()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 200
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        {children}
      </DialogContent>

      {/* Actions */}
      {showActions && (
        <>
          <Divider />
          <DialogActions sx={{ p: 2, gap: 1 }}>
            {customActions || (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outlined"
                  startIcon={<Cancel />}
                  disabled={loading}
                >
                  {cancelLabel}
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={16} /> : <Save />}
                  disabled={loading || disabled}
                  sx={{
                    background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                    },
                    '&:disabled': {
                      background: '#ccc',
                    }
                  }}
                >
                  {submitLabel}
                </Button>
              </>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

// Form Field Components
export interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
  fullWidth?: boolean
}

export function FormField({ label, required, error, children, fullWidth = true }: FormFieldProps) {
  return (
    <Box sx={{ mb: 2, width: fullWidth ? '100%' : 'auto' }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium' }}>
        {label}
        {required && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
      </Typography>
      {children}
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}

// Form Section Component
export interface FormSectionProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  collapsible?: boolean
  defaultExpanded?: boolean
}

export function FormSection({ 
  title, 
  subtitle, 
  children, 
  collapsible = false, 
  defaultExpanded = true 
}: FormSectionProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  return (
    <Box sx={{ mb: 3 }}>
      <Box 
        sx={{ 
          mb: 2, 
          cursor: collapsible ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        onClick={collapsible ? () => setExpanded(!expanded) : undefined}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {(!collapsible || expanded) && (
        <Box>{children}</Box>
      )}
    </Box>
  )
}

// Form Grid Component for responsive layouts
export interface FormGridProps {
  children: React.ReactNode
  columns?: number
  spacing?: number
}

export function FormGrid({ children, columns = 2, spacing = 2 }: FormGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: spacing,
        '@media (max-width: 600px)': {
          gridTemplateColumns: '1fr',
        }
      }}
    >
      {children}
    </Box>
  )
}

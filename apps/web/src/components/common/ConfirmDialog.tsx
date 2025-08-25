import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material'
import { Warning, Delete, Cancel, CheckCircle, Error, Info } from '@mui/icons-material'

export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  severity?: 'warning' | 'error' | 'info' | 'success'
  icon?: React.ReactNode
  details?: string[]
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  severity = 'warning',
  icon,
  details = []
}: ConfirmDialogProps) {
  const getIcon = () => {
    if (icon) return icon
    
    switch (severity) {
      case 'error':
        return <Error sx={{ fontSize: 48, color: 'error.main' }} />
      case 'warning':
        return <Warning sx={{ fontSize: 48, color: 'warning.main' }} />
      case 'info':
        return <Info sx={{ fontSize: 48, color: 'info.main' }} />
      case 'success':
        return <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />
      default:
        return <Warning sx={{ fontSize: 48, color: 'warning.main' }} />
    }
  }

  const getButtonColor = () => {
    switch (severity) {
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      case 'success':
        return 'success'
      default:
        return 'warning'
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          textAlign: 'center'
        }
      }}
    >
      <DialogTitle sx={{ pt: 4, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {getIcon()}
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pb: 2 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {message}
        </Typography>

        {details.length > 0 && (
          <Alert severity={severity} sx={{ mt: 2, textAlign: 'left' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              This action will:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {details.map((detail, index) => (
                <li key={index}>
                  <Typography variant="body2">{detail}</Typography>
                </li>
              ))}
            </ul>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          startIcon={<Cancel />}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={getButtonColor()}
          startIcon={loading ? <CircularProgress size={16} /> : <Delete />}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// Specialized Delete Confirmation Dialog
export interface DeleteConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
  itemType?: string
  loading?: boolean
  cascadeWarnings?: string[]
}

export function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  itemName,
  itemType = 'item',
  loading = false,
  cascadeWarnings = []
}: DeleteConfirmDialogProps) {
  const details = [
    `Permanently delete "${itemName}"`,
    'This action cannot be undone',
    ...cascadeWarnings
  ]

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Delete ${itemType}?`}
      message={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
      confirmLabel="Delete"
      cancelLabel="Cancel"
      loading={loading}
      severity="error"
      details={details}
    />
  )
}

// Bulk Delete Confirmation Dialog
export interface BulkDeleteConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  count: number
  itemType?: string
  loading?: boolean
}

export function BulkDeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  count,
  itemType = 'items',
  loading = false
}: BulkDeleteConfirmDialogProps) {
  const details = [
    `Permanently delete ${count} ${itemType}`,
    'This action cannot be undone',
    'All related data will also be removed'
  ]

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Delete ${count} ${itemType}?`}
      message={`Are you sure you want to delete ${count} selected ${itemType}? This action cannot be undone.`}
      confirmLabel={`Delete ${count} ${itemType}`}
      cancelLabel="Cancel"
      loading={loading}
      severity="error"
      details={details}
    />
  )
}

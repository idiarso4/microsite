import React, { useState, useEffect } from 'react'
import {
  TextField,
  MenuItem,
  Grid,
  Box,
  Chip,
  InputAdornment,
  Alert,
  Typography,
  Autocomplete
} from '@mui/material'
import {
  Person,
  CalendarToday,
  BeachAccess,
  Notes,
  Schedule,
  CheckCircle,
  Cancel,
  Pending
} from '@mui/icons-material'
import { FormModal, FormField, FormSection, FormGrid } from '../common'

export interface LeaveRequestFormData {
  id?: number
  employeeId: number
  employeeName?: string
  leaveType: string
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: number
  approverName?: string
  approvedDate?: string
  rejectionReason?: string
  notes?: string
}

export interface LeaveRequestFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: LeaveRequestFormData) => Promise<void>
  initialData?: Partial<LeaveRequestFormData>
  loading?: boolean
  mode?: 'create' | 'edit' | 'approve'
  employees?: Array<{ id: number; name: string }>
  approvers?: Array<{ id: number; name: string }>
  currentUser?: { id: number; name: string; role: string }
}

const leaveTypes = [
  { value: 'annual', label: 'Annual Leave', color: '#4caf50' },
  { value: 'sick', label: 'Sick Leave', color: '#f44336' },
  { value: 'maternity', label: 'Maternity Leave', color: '#e91e63' },
  { value: 'paternity', label: 'Paternity Leave', color: '#2196f3' },
  { value: 'emergency', label: 'Emergency Leave', color: '#ff9800' },
  { value: 'unpaid', label: 'Unpaid Leave', color: '#9e9e9e' },
  { value: 'compensatory', label: 'Compensatory Leave', color: '#9c27b0' }
]

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'warning', icon: <Pending /> },
  { value: 'approved', label: 'Approved', color: 'success', icon: <CheckCircle /> },
  { value: 'rejected', label: 'Rejected', color: 'error', icon: <Cancel /> }
]

export default function LeaveRequestForm({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  mode = 'create',
  employees = [],
  approvers = [],
  currentUser
}: LeaveRequestFormProps) {
  const [formData, setFormData] = useState<LeaveRequestFormData>({
    employeeId: currentUser?.id || 0,
    employeeName: currentUser?.name || '',
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    totalDays: 0,
    reason: '',
    status: 'pending',
    approvedBy: undefined,
    approverName: '',
    approvedDate: '',
    rejectionReason: '',
    notes: '',
    ...initialData
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  useEffect(() => {
    // Calculate total days when dates change
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      setFormData(prev => ({ ...prev, totalDays: diffDays }))
    }
  }, [formData.startDate, formData.endDate])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.employeeId) {
      newErrors.employeeId = 'Employee is required'
    }

    if (!formData.leaveType) {
      newErrors.leaveType = 'Leave type is required'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (end < start) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required'
    }

    if (mode === 'approve' && formData.status === 'rejected' && !formData.rejectionReason?.trim()) {
      newErrors.rejectionReason = 'Rejection reason is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      // Set approval details if approving
      if (mode === 'approve' && currentUser) {
        formData.approvedBy = currentUser.id
        formData.approverName = currentUser.name
        formData.approvedDate = new Date().toISOString().split('T')[0]
      }

      await onSubmit(formData)
      handleClose()
    } catch (error) {
      console.error('Failed to submit leave request:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      employeeId: currentUser?.id || 0,
      employeeName: currentUser?.name || '',
      leaveType: 'annual',
      startDate: '',
      endDate: '',
      totalDays: 0,
      reason: '',
      status: 'pending',
      approvedBy: undefined,
      approverName: '',
      approvedDate: '',
      rejectionReason: '',
      notes: ''
    })
    setErrors({})
    onClose()
  }

  const handleChange = (field: keyof LeaveRequestFormData) => (
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

  const handleEmployeeChange = (event: any, newValue: any) => {
    setFormData(prev => ({
      ...prev,
      employeeId: newValue?.id || 0,
      employeeName: newValue?.name || ''
    }))
  }

  const selectedLeaveType = leaveTypes.find(t => t.value === formData.leaveType)
  const selectedStatus = statusOptions.find(s => s.value === formData.status)

  const isApprovalMode = mode === 'approve'
  const canEditEmployee = mode === 'create' && currentUser?.role === 'manager'

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={
        mode === 'create' ? 'Submit Leave Request' : 
        mode === 'approve' ? 'Review Leave Request' : 
        'Edit Leave Request'
      }
      subtitle={
        mode === 'create' ? 'Submit a new leave request' : 
        mode === 'approve' ? 'Approve or reject leave request' : 
        'Update leave request details'
      }
      loading={loading}
      maxWidth="md"
    >
      <Box sx={{ minHeight: 500 }}>
        <FormSection title="Leave Request Details" subtitle="Basic leave information">
          <FormGrid columns={2}>
            <FormField label="Employee" required error={errors.employeeId}>
              {canEditEmployee ? (
                <Autocomplete
                  options={employees}
                  getOptionLabel={(option) => option.name}
                  value={employees.find(e => e.id === formData.employeeId) || null}
                  onChange={handleEmployeeChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select employee"
                      error={!!errors.employeeId}
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
              ) : (
                <TextField
                  fullWidth
                  value={formData.employeeName}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </FormField>

            <FormField label="Leave Type" required error={errors.leaveType}>
              <TextField
                select
                fullWidth
                value={formData.leaveType}
                onChange={handleChange('leaveType')}
                error={!!errors.leaveType}
                disabled={isApprovalMode}
              >
                {leaveTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: type.color
                        }}
                      />
                      {type.label}
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
                disabled={isApprovalMode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="End Date" required error={errors.endDate}>
              <TextField
                fullWidth
                type="date"
                value={formData.endDate}
                onChange={handleChange('endDate')}
                error={!!errors.endDate}
                disabled={isApprovalMode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField label="Total Days">
              <TextField
                fullWidth
                value={formData.totalDays}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Schedule />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            {isApprovalMode && (
              <FormField label="Status" required>
                <TextField
                  select
                  fullWidth
                  value={formData.status}
                  onChange={handleChange('status')}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {status.icon}
                        <Chip
                          size="small"
                          label={status.label}
                          color={status.color as any}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </FormField>
            )}
          </FormGrid>

          <FormField label="Reason" required error={errors.reason}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.reason}
              onChange={handleChange('reason')}
              placeholder="Enter reason for leave request..."
              error={!!errors.reason}
              disabled={isApprovalMode}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <BeachAccess />
                  </InputAdornment>
                ),
              }}
            />
          </FormField>

          {isApprovalMode && formData.status === 'rejected' && (
            <FormField label="Rejection Reason" required error={errors.rejectionReason}>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={formData.rejectionReason}
                onChange={handleChange('rejectionReason')}
                placeholder="Enter reason for rejection..."
                error={!!errors.rejectionReason}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <Cancel />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>
          )}

          <FormField label="Additional Notes">
            <TextField
              fullWidth
              multiline
              rows={2}
              value={formData.notes}
              onChange={handleChange('notes')}
              placeholder="Enter any additional notes..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <Notes />
                  </InputAdornment>
                ),
              }}
            />
          </FormField>
        </FormSection>

        {/* Display current status if editing */}
        {mode === 'edit' && selectedStatus && (
          <Alert 
            severity={selectedStatus.color as any} 
            sx={{ mt: 2 }}
            icon={selectedStatus.icon}
          >
            <Typography variant="body2">
              Current Status: <strong>{selectedStatus.label}</strong>
              {formData.approverName && (
                <>
                  <br />
                  Approved by: {formData.approverName} on {formData.approvedDate}
                </>
              )}
            </Typography>
          </Alert>
        )}

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Please fix the errors above before submitting.
          </Alert>
        )}
      </Box>
    </FormModal>
  )
}

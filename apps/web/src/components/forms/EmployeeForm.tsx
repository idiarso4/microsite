import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  InputAdornment,
  CircularProgress,
  Alert,
  MenuItem
} from '@mui/material'
import {
  Person,
  Email,
  Phone,
  Home,
  Work,
  Business,
  AttachMoney,
  CalendarToday,
  ContactPhone
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import FormTextField from './FormTextField'
import FormSelect from './FormSelect'

// Employee validation schema
const employeeSchema = yup.object({
  name: yup.string().required('Nama wajib diisi'),
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  phone: yup.string().optional(),
  address: yup.string().optional(),
  position: yup.string().required('Posisi wajib diisi'),
  department: yup.string().required('Department wajib dipilih'),
  salary: yup.number().positive('Salary harus lebih dari 0').required('Salary wajib diisi'),
  hireDate: yup.string().required('Tanggal masuk wajib diisi'),
  birthDate: yup.string().optional(),
  emergencyContact: yup.string().optional(),
  emergencyPhone: yup.string().optional()
})

export type EmployeeFormData = yup.InferType<typeof employeeSchema>

interface EmployeeFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: EmployeeFormData) => Promise<void>
  initialData?: Partial<EmployeeFormData>
  title?: string
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title = 'Add New Employee'
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<EmployeeFormData>({
    resolver: yupResolver(employeeSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      position: initialData?.position || '',
      department: initialData?.department || 'IT',
      salary: initialData?.salary || 0,
      hireDate: initialData?.hireDate || new Date().toISOString().split('T')[0],
      birthDate: initialData?.birthDate || '',
      emergencyContact: initialData?.emergencyContact || '',
      emergencyPhone: initialData?.emergencyPhone || ''
    }
  })

  const departmentOptions = [
    { value: 'IT', label: 'Information Technology' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Support', label: 'Customer Support' }
  ]

  const handleFormSubmit = async (data: EmployeeFormData) => {
    setLoading(true)
    setError('')

    try {
      await onSubmit(data)
      reset()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan employee')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setError('')
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 2, 
        borderBottom: '1px solid #e0e0e0',
        background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
        color: 'white'
      }}>
        {title}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormTextField
              name="name"
              control={control}
              label="Full Name"
              placeholder="Budi Santoso"
              startAdornment={
                <InputAdornment position="start">
                  <Person sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="email"
              control={control}
              label="Email"
              type="email"
              placeholder="budi.santoso@company.com"
              startAdornment={
                <InputAdornment position="start">
                  <Email sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="phone"
              control={control}
              label="Phone Number"
              placeholder="081234567890"
              startAdornment={
                <InputAdornment position="start">
                  <Phone sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="position"
              control={control}
              label="Position"
              placeholder="Software Engineer"
              startAdornment={
                <InputAdornment position="start">
                  <Work sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormSelect
              name="department"
              control={control}
              label="Department"
              options={departmentOptions}
              placeholder="Pilih department"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="salary"
              control={control}
              label="Salary (Rp)"
              type="number"
              placeholder="12000000"
              startAdornment={
                <InputAdornment position="start">
                  <AttachMoney sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="hireDate"
              control={control}
              label="Hire Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              startAdornment={
                <InputAdornment position="start">
                  <CalendarToday sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="birthDate"
              control={control}
              label="Birth Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              startAdornment={
                <InputAdornment position="start">
                  <CalendarToday sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12}>
            <FormTextField
              name="address"
              control={control}
              label="Address"
              placeholder="Jl. Merdeka No. 45, Jakarta"
              multiline
              rows={2}
              startAdornment={
                <InputAdornment position="start">
                  <Home sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="emergencyContact"
              control={control}
              label="Emergency Contact Name"
              placeholder="Siti Santoso"
              startAdornment={
                <InputAdornment position="start">
                  <ContactPhone sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="emergencyPhone"
              control={control}
              label="Emergency Contact Phone"
              placeholder="081987654321"
              startAdornment={
                <InputAdornment position="start">
                  <Phone sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ 
            borderColor: '#DC143C',
            color: '#DC143C',
            '&:hover': {
              borderColor: '#B91C3C',
              backgroundColor: 'rgba(220, 20, 60, 0.04)'
            }
          }}
        >
          Batal
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={loading || isSubmitting}
          sx={{
            background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
            }
          }}
        >
          {(loading || isSubmitting) ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
              Menyimpan...
            </>
          ) : (
            'Simpan'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EmployeeForm

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
  Alert
} from '@mui/material'
import {
  Business,
  Person,
  Email,
  Phone,
  AttachMoney,
  Notes
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { leadSchema, LeadFormData } from '../../utils/validationSchemas'
import FormTextField from './FormTextField'
import FormSelect from './FormSelect'

interface LeadFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: LeadFormData) => Promise<void>
  initialData?: Partial<LeadFormData>
  title?: string
}

const statusOptions = [
  { value: 'cold', label: 'Cold' },
  { value: 'warm', label: 'Warm' },
  { value: 'hot', label: 'Hot' }
]

const stageOptions = [
  { value: 'qualification', label: 'Qualification' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closing', label: 'Closing' }
]

const LeadForm: React.FC<LeadFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title = 'Tambah Lead Baru'
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<LeadFormData>({
    resolver: yupResolver(leadSchema),
    defaultValues: {
      company: initialData?.company || '',
      contactName: initialData?.contactName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      value: initialData?.value || 0,
      status: initialData?.status || 'cold',
      stage: initialData?.stage || 'qualification',
      notes: initialData?.notes || ''
    }
  })

  const handleFormSubmit = async (data: LeadFormData) => {
    setLoading(true)
    setError('')

    try {
      await onSubmit(data)
      reset()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan lead')
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
              name="company"
              control={control}
              label="Nama Perusahaan"
              placeholder="PT. Contoh Perusahaan"
              startAdornment={
                <InputAdornment position="start">
                  <Business sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="contactName"
              control={control}
              label="Nama Kontak"
              placeholder="John Doe"
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
              placeholder="john@company.com"
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
              label="Nomor Telepon"
              placeholder="+6281234567890"
              startAdornment={
                <InputAdornment position="start">
                  <Phone sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="value"
              control={control}
              label="Nilai Deal (Rp)"
              type="number"
              placeholder="1000000"
              startAdornment={
                <InputAdornment position="start">
                  <AttachMoney sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormSelect
              name="status"
              control={control}
              label="Status"
              options={statusOptions}
              placeholder="Pilih status"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormSelect
              name="stage"
              control={control}
              label="Stage"
              options={stageOptions}
              placeholder="Pilih stage"
            />
          </Grid>

          <Grid item xs={12}>
            <FormTextField
              name="notes"
              control={control}
              label="Catatan"
              placeholder="Catatan tambahan tentang lead ini..."
              multiline
              rows={3}
              startAdornment={
                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                  <Notes sx={{ color: '#DC143C' }} />
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

export default LeadForm

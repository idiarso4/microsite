import React, { useState, useEffect } from 'react'
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
  Inventory,
  Category,
  AttachMoney,
  Numbers,
  Description
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { productSchema, ProductFormData } from '../../utils/validationSchemas'
import FormTextField from './FormTextField'
import FormSelect from './FormSelect'
import { apiService } from '../../services/api'

interface ProductFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ProductFormData) => Promise<void>
  initialData?: Partial<ProductFormData>
  title?: string
}

const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title = 'Add New Product'
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<any[]>([])

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      sku: initialData?.sku || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      cost: initialData?.cost || 0,
      stock: initialData?.stock || 0,
      minStock: initialData?.minStock || 0,
      categoryId: initialData?.categoryId || 1
    }
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService.getCategories()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    if (open) {
      fetchCategories()
    }
  }, [open])

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }))

  const handleFormSubmit = async (data: ProductFormData) => {
    setLoading(true)
    setError('')

    try {
      await onSubmit(data)
      reset()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan produk')
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
              label="Nama Produk"
              placeholder="Laptop Dell Inspiron 15"
              startAdornment={
                <InputAdornment position="start">
                  <Inventory sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="sku"
              control={control}
              label="SKU"
              placeholder="DELL-INS-15-001"
              startAdornment={
                <InputAdornment position="start">
                  <Numbers sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="price"
              control={control}
              label="Harga (Rp)"
              type="number"
              placeholder="8500000"
              startAdornment={
                <InputAdornment position="start">
                  <AttachMoney sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="cost"
              control={control}
              label="Cost (Rp)"
              type="number"
              placeholder="7000000"
              startAdornment={
                <InputAdornment position="start">
                  <AttachMoney sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormSelect
              name="categoryId"
              control={control}
              label="Kategori"
              options={categoryOptions}
              placeholder="Pilih kategori"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="stock"
              control={control}
              label="Stok"
              type="number"
              placeholder="45"
              startAdornment={
                <InputAdornment position="start">
                  <Inventory sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="minStock"
              control={control}
              label="Minimum Stok"
              type="number"
              placeholder="10"
              startAdornment={
                <InputAdornment position="start">
                  <Inventory sx={{ color: '#DC143C' }} />
                </InputAdornment>
              }
            />
          </Grid>

          <Grid item xs={12}>
            <FormTextField
              name="description"
              control={control}
              label="Deskripsi"
              placeholder="Deskripsi produk..."
              multiline
              rows={3}
              startAdornment={
                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                  <Description sx={{ color: '#DC143C' }} />
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

export default ProductForm

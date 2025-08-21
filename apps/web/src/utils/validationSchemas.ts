import * as yup from 'yup'

// Login form validation schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email wajib diisi')
    .email('Format email tidak valid')
    .trim(),
  password: yup
    .string()
    .required('Password wajib diisi')
    .min(3, 'Password minimal 3 karakter')
})

// Registration form validation schema
export const registerSchema = yup.object({
  name: yup
    .string()
    .required('Nama wajib diisi')
    .min(2, 'Nama minimal 2 karakter')
    .max(50, 'Nama maksimal 50 karakter')
    .trim(),
  email: yup
    .string()
    .required('Email wajib diisi')
    .email('Format email tidak valid')
    .trim(),
  password: yup
    .string()
    .required('Password wajib diisi')
    .min(8, 'Password minimal 8 karakter')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password harus mengandung huruf besar, huruf kecil, dan angka'
    ),
  confirmPassword: yup
    .string()
    .required('Konfirmasi password wajib diisi')
    .oneOf([yup.ref('password')], 'Password tidak cocok'),
  company: yup
    .string()
    .optional()
    .max(100, 'Nama perusahaan maksimal 100 karakter')
    .trim()
})

// Lead form validation schema
export const leadSchema = yup.object({
  company: yup
    .string()
    .required('Nama perusahaan wajib diisi')
    .min(2, 'Nama perusahaan minimal 2 karakter')
    .max(100, 'Nama perusahaan maksimal 100 karakter')
    .trim(),
  contactName: yup
    .string()
    .required('Nama kontak wajib diisi')
    .min(2, 'Nama kontak minimal 2 karakter')
    .max(50, 'Nama kontak maksimal 50 karakter')
    .trim(),
  email: yup
    .string()
    .required('Email wajib diisi')
    .email('Format email tidak valid')
    .trim(),
  phone: yup
    .string()
    .required('Nomor telepon wajib diisi')
    .matches(
      /^(\+62|62|0)[0-9]{9,13}$/,
      'Format nomor telepon tidak valid (contoh: +6281234567890)'
    ),
  value: yup
    .number()
    .required('Nilai deal wajib diisi')
    .min(0, 'Nilai deal tidak boleh negatif')
    .max(999999999999, 'Nilai deal terlalu besar'),
  status: yup
    .string()
    .required('Status wajib dipilih')
    .oneOf(['cold', 'warm', 'hot'], 'Status tidak valid'),
  stage: yup
    .string()
    .required('Stage wajib dipilih')
    .oneOf(['qualification', 'proposal', 'negotiation', 'closing'], 'Stage tidak valid'),
  notes: yup
    .string()
    .optional()
    .max(500, 'Catatan maksimal 500 karakter')
    .trim()
})

// Product form validation schema
export const productSchema = yup.object({
  name: yup
    .string()
    .required('Nama produk wajib diisi')
    .min(2, 'Nama produk minimal 2 karakter')
    .max(100, 'Nama produk maksimal 100 karakter')
    .trim(),
  sku: yup
    .string()
    .required('SKU wajib diisi')
    .matches(
      /^[A-Z0-9-]+$/,
      'SKU hanya boleh mengandung huruf besar, angka, dan tanda hubung'
    )
    .min(3, 'SKU minimal 3 karakter')
    .max(20, 'SKU maksimal 20 karakter')
    .trim(),
  description: yup
    .string()
    .optional()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .trim(),
  price: yup
    .number()
    .required('Harga wajib diisi')
    .min(0, 'Harga tidak boleh negatif')
    .max(999999999999, 'Harga terlalu besar'),
  cost: yup
    .number()
    .optional()
    .min(0, 'Cost tidak boleh negatif')
    .max(999999999999, 'Cost terlalu besar'),
  stock: yup
    .number()
    .required('Stok wajib diisi')
    .integer('Stok harus berupa bilangan bulat')
    .min(0, 'Stok tidak boleh negatif')
    .max(999999, 'Stok terlalu besar'),
  minStock: yup
    .number()
    .required('Minimum stok wajib diisi')
    .integer('Minimum stok harus berupa bilangan bulat')
    .min(0, 'Minimum stok tidak boleh negatif')
    .max(999999, 'Minimum stok terlalu besar'),
  categoryId: yup
    .number()
    .required('Kategori wajib dipilih')
    .integer('Kategori tidak valid')
    .min(1, 'Kategori wajib dipilih')
})

export type ProductFormData = yup.InferType<typeof productSchema>

// Profile update validation schema
export const profileSchema = yup.object({
  name: yup
    .string()
    .required('Nama wajib diisi')
    .min(2, 'Nama minimal 2 karakter')
    .max(50, 'Nama maksimal 50 karakter')
    .trim(),
  email: yup
    .string()
    .required('Email wajib diisi')
    .email('Format email tidak valid')
    .trim(),
  company: yup
    .string()
    .optional()
    .max(100, 'Nama perusahaan maksimal 100 karakter')
    .trim()
})

// Change password validation schema
export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Password saat ini wajib diisi'),
  newPassword: yup
    .string()
    .required('Password baru wajib diisi')
    .min(8, 'Password minimal 8 karakter')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password harus mengandung huruf besar, huruf kecil, dan angka'
    ),
  confirmNewPassword: yup
    .string()
    .required('Konfirmasi password baru wajib diisi')
    .oneOf([yup.ref('newPassword')], 'Password tidak cocok')
})

// Search form validation schema
export const searchSchema = yup.object({
  query: yup
    .string()
    .optional()
    .max(100, 'Pencarian maksimal 100 karakter')
    .trim()
})

// Contact form validation schema
export const contactSchema = yup.object({
  name: yup
    .string()
    .required('Nama wajib diisi')
    .min(2, 'Nama minimal 2 karakter')
    .max(50, 'Nama maksimal 50 karakter')
    .trim(),
  email: yup
    .string()
    .required('Email wajib diisi')
    .email('Format email tidak valid')
    .trim(),
  subject: yup
    .string()
    .required('Subjek wajib diisi')
    .min(5, 'Subjek minimal 5 karakter')
    .max(100, 'Subjek maksimal 100 karakter')
    .trim(),
  message: yup
    .string()
    .required('Pesan wajib diisi')
    .min(10, 'Pesan minimal 10 karakter')
    .max(1000, 'Pesan maksimal 1000 karakter')
    .trim()
})

// Export types for TypeScript
export type LoginFormData = yup.InferType<typeof loginSchema>
export type RegisterFormData = yup.InferType<typeof registerSchema>
export type LeadFormData = yup.InferType<typeof leadSchema>
export type ProfileFormData = yup.InferType<typeof profileSchema>
export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>
export type SearchFormData = yup.InferType<typeof searchSchema>
export type ContactFormData = yup.InferType<typeof contactSchema>

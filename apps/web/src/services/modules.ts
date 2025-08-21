import { apiService } from './api'

// Types for our ERP modules
export interface Account {
  id: string
  tenant_id: string
  code: string
  name: string
  account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  account_subtype?: string
  parent_id?: string
  is_active: boolean
  description?: string
  balance_type: 'debit' | 'credit'
  created_at: string
  updated_at: string
}

export interface JournalEntry {
  id: string
  tenant_id: string
  entry_number: string
  entry_date: string
  reference?: string
  description: string
  total_debit: number
  total_credit: number
  status: 'draft' | 'posted' | 'reversed'
  created_by: string
  posted_by?: string
  posted_at?: string
  created_at: string
  updated_at: string
  lines?: JournalEntryLine[]
}

export interface JournalEntryLine {
  id: string
  tenant_id: string
  journal_entry_id: string
  account_id: string
  account?: Account
  description?: string
  debit_amount: number
  credit_amount: number
  line_number: number
  created_at: string
}

export interface Product {
  id: string
  tenant_id: string
  sku: string
  name: string
  description?: string
  category_id?: string
  category?: ProductCategory
  unit_of_measure: string
  cost_price: number
  selling_price: number
  minimum_stock: number
  current_stock: number
  status: 'active' | 'inactive' | 'discontinued' | 'out_of_stock'
  barcode?: string
  weight?: number
  dimensions?: any
  supplier_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductCategory {
  id: string
  tenant_id: string
  name: string
  description?: string
  parent_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Warehouse {
  id: string
  tenant_id: string
  code: string
  name: string
  description?: string
  address?: any
  manager_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StockLevel {
  id: string
  tenant_id: string
  product_id: string
  product?: Product
  warehouse_id: string
  warehouse?: Warehouse
  quantity_on_hand: number
  quantity_reserved: number
  quantity_available: number
  minimum_stock: number
  maximum_stock?: number
  reorder_point?: number
  last_movement_at?: string
  updated_at: string
}

export interface Vendor {
  id: string
  tenant_id: string
  code: string
  name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: any
  tax_number?: string
  payment_terms?: string
  currency: string
  status: 'active' | 'inactive' | 'blocked' | 'pending'
  credit_limit?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PurchaseOrder {
  id: string
  tenant_id: string
  po_number: string
  vendor_id: string
  vendor?: Vendor
  order_date: string
  expected_delivery_date?: string
  delivery_address?: any
  status: 'draft' | 'pending' | 'approved' | 'sent' | 'partially_received' | 'received' | 'cancelled' | 'closed'
  currency: string
  exchange_rate: number
  subtotal: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  notes?: string
  terms_conditions?: string
  created_by: string
  approved_by?: string
  approved_at?: string
  created_at: string
  updated_at: string
  items?: PurchaseOrderItem[]
}

export interface PurchaseOrderItem {
  id: string
  tenant_id: string
  purchase_order_id: string
  product_id: string
  product_sku?: string
  product_name?: string
  description?: string
  quantity_ordered: number
  quantity_received: number
  unit_price: number
  discount_percent: number
  discount_amount: number
  tax_percent: number
  tax_amount: number
  line_total: number
  line_number: number
  created_at: string
}

export interface Company {
  id: string
  tenant_id: string
  name: string
  industry?: string
  size?: string
  website?: string
  phone?: string
  email?: string
  address?: any
  status: 'active' | 'inactive' | 'prospect'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  tenant_id: string
  company_id?: string
  company?: Company
  first_name: string
  last_name: string
  email?: string
  phone?: string
  position?: string
  status: 'active' | 'inactive'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    current_page: number
    per_page: number
    total_pages: number
    total_count: number
    has_next: boolean
    has_prev: boolean
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Accounting API
export const accountingApi = {
  // Accounts
  getAccounts: (params?: { page?: number; per_page?: number; search?: string; account_type?: string }) =>
    apiService.request<ApiResponse<PaginatedResponse<Account>>>('/v1/accounting/accounts', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }),

  createAccount: (data: Partial<Account>) =>
    apiService.request<ApiResponse<Account>>('/v1/accounting/accounts', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getAccount: (id: string) =>
    apiService.request<ApiResponse<Account>>(`/v1/accounting/accounts/${id}`),

  // Journal Entries
  getJournalEntries: (params?: { page?: number; per_page?: number; search?: string; status?: string }) =>
    apiService.request<ApiResponse<PaginatedResponse<JournalEntry>>>('/v1/accounting/journal-entries', {
      method: 'GET'
    }),

  createJournalEntry: (data: Partial<JournalEntry>) =>
    apiService.request<ApiResponse<JournalEntry>>('/v1/accounting/journal-entries', {
      method: 'POST',
      body: JSON.stringify(data)
    })
}

// Inventory API
export const inventoryApi = {
  // Products
  getProducts: (params?: { page?: number; per_page?: number; search?: string; category_id?: string; status?: string; low_stock?: boolean }) =>
    apiService.request<ApiResponse<PaginatedResponse<Product>>>('/v1/inventory/products'),

  createProduct: (data: Partial<Product>) =>
    apiService.request<ApiResponse<Product>>('/v1/inventory/products', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getProduct: (id: string) =>
    apiService.request<ApiResponse<Product>>(`/v1/inventory/products/${id}`),

  updateProduct: (id: string, data: Partial<Product>) =>
    apiService.request<ApiResponse<Product>>(`/v1/inventory/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteProduct: (id: string) =>
    apiService.request<ApiResponse<any>>(`/v1/inventory/products/${id}`, {
      method: 'DELETE'
    }),

  // Warehouses
  getWarehouses: (params?: { page?: number; per_page?: number; search?: string }) =>
    apiService.request<ApiResponse<PaginatedResponse<Warehouse>>>('/v1/inventory/warehouses'),

  createWarehouse: (data: Partial<Warehouse>) =>
    apiService.request<ApiResponse<Warehouse>>('/v1/inventory/warehouses', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Stock
  getStock: (params?: { page?: number; per_page?: number; warehouse_id?: string; low_stock?: boolean; search?: string }) =>
    apiService.request<ApiResponse<PaginatedResponse<StockLevel>>>('/v1/inventory/stock')
}

// Procurement API
export const procurementApi = {
  // Vendors
  getVendors: (params?: { page?: number; per_page?: number; search?: string; status?: string }) =>
    apiService.request<ApiResponse<PaginatedResponse<Vendor>>>('/v1/procurement/vendors'),

  createVendor: (data: Partial<Vendor>) =>
    apiService.request<ApiResponse<Vendor>>('/v1/procurement/vendors', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Purchase Orders
  getPurchaseOrders: (params?: { page?: number; per_page?: number; search?: string; vendor_id?: string; status?: string }) =>
    apiService.request<ApiResponse<PaginatedResponse<PurchaseOrder>>>('/v1/procurement/purchase-orders'),

  createPurchaseOrder: (data: Partial<PurchaseOrder>) =>
    apiService.request<ApiResponse<PurchaseOrder>>('/v1/procurement/purchase-orders', {
      method: 'POST',
      body: JSON.stringify(data)
    })
}

// CRM API
export const crmApi = {
  // Companies
  getCompanies: (params?: { page?: number; per_page?: number; search?: string; status?: string }) =>
    apiService.request<ApiResponse<PaginatedResponse<Company>>>('/v1/crm/companies'),

  createCompany: (data: Partial<Company>) =>
    apiService.request<ApiResponse<Company>>('/v1/crm/companies', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getCompany: (id: string) =>
    apiService.request<ApiResponse<Company>>(`/v1/crm/companies/${id}`),

  updateCompany: (id: string, data: Partial<Company>) =>
    apiService.request<ApiResponse<Company>>(`/v1/crm/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteCompany: (id: string) =>
    apiService.request<ApiResponse<any>>(`/v1/crm/companies/${id}`, {
      method: 'DELETE'
    }),

  // Contacts
  getContacts: (params?: { page?: number; per_page?: number; search?: string; company_id?: string; status?: string }) =>
    apiService.request<ApiResponse<PaginatedResponse<Contact>>>('/v1/crm/contacts'),

  createContact: (data: Partial<Contact>) =>
    apiService.request<ApiResponse<Contact>>('/v1/crm/contacts', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getContact: (id: string) =>
    apiService.request<ApiResponse<Contact>>(`/v1/crm/contacts/${id}`),

  updateContact: (id: string, data: Partial<Contact>) =>
    apiService.request<ApiResponse<Contact>>(`/v1/crm/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteContact: (id: string) =>
    apiService.request<ApiResponse<any>>(`/v1/crm/contacts/${id}`, {
      method: 'DELETE'
    })
}

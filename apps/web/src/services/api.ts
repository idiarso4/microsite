const API_BASE_URL = 'http://localhost:3001/api'

// API service class
class ApiService {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: { email: string; password: string; name: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getProfile() {
    return this.request('/auth/me')
  }

  async updateProfile(userData: any) {
    return this.request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }

  async logout() {
    const token = localStorage.getItem('auth_token')
    if (token) {
      localStorage.removeItem('auth_token')
    }
    return Promise.resolve()
  }

  // Dashboard endpoints
  async getDashboardOverview() {
    return this.request('/dashboard/overview')
  }

  async getSalesPerformance() {
    return this.request('/dashboard/sales-performance')
  }

  // Leads endpoints
  async getLeads(params?: { page?: number; limit?: number; status?: string; search?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.search) queryParams.append('search', params.search)

    const query = queryParams.toString()
    return this.request(`/leads${query ? `?${query}` : ''}`)
  }

  async getLead(id: number) {
    return this.request(`/leads/${id}`)
  }

  async createLead(leadData: any) {
    return this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    })
  }

  async updateLead(id: number, leadData: any) {
    return this.request(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    })
  }

  async deleteLead(id: number) {
    return this.request(`/leads/${id}`, {
      method: 'DELETE',
    })
  }

  // Products endpoints
  async getProducts(params?: { page?: number; limit?: number; categoryId?: number; search?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId.toString())
    if (params?.search) queryParams.append('search', params.search)

    const query = queryParams.toString()
    return this.request(`/products${query ? `?${query}` : ''}`)
  }

  async getProduct(id: number) {
    return this.request(`/products/${id}`)
  }

  async createProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(id: number, productData: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  }

  async deleteProduct(id: number) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  // Orders endpoints
  async getOrders(params?: { page?: number; limit?: number; status?: string; search?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.search) queryParams.append('search', params.search)

    const query = queryParams.toString()
    return this.request(`/orders${query ? `?${query}` : ''}`)
  }

  async getOrder(id: number) {
    return this.request(`/orders/${id}`)
  }

  async createOrder(data: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateOrder(id: number, data: any) {
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteOrder(id: number) {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    })
  }

  async updateOrderStatus(id: number, status: string) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  // Users endpoints
  async getUsers(params?: { page?: number; limit?: number; role?: string; search?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.role) queryParams.append('role', params.role)
    if (params?.search) queryParams.append('search', params.search)

    const query = queryParams.toString()
    return this.request(`/users${query ? `?${query}` : ''}`)
  }

  async getUser(id: number) {
    return this.request(`/users/${id}`)
  }

  async updateUser(id: number, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async deactivateUser(id: number) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  // Categories endpoints
  async getCategories() {
    return this.request('/categories')
  }

  // Customers endpoints
  async getCustomers() {
    return this.request('/customers')
  }

  // Finance endpoints
  async getFinanceOverview() {
    return this.request('/finance/overview')
  }

  async getFinanceTransactions(params?: any) {
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/finance/transactions${queryParams ? `?${queryParams}` : ''}`)
  }

  async createTransaction(data: any) {
    return this.request('/finance/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTransaction(id: number, data: any) {
    return this.request(`/finance/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTransaction(id: number) {
    return this.request(`/finance/transactions/${id}`, {
      method: 'DELETE',
    })
  }

  // Purchases endpoints
  async getPurchases(params?: any) {
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/purchases${queryParams ? `?${queryParams}` : ''}`)
  }

  async createPurchase(data: any) {
    return this.request('/purchases', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePurchase(id: number, data: any) {
    return this.request(`/purchases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deletePurchase(id: number) {
    return this.request(`/purchases/${id}`, {
      method: 'DELETE',
    })
  }

  async getPurchase(id: number) {
    return this.request(`/purchases/${id}`)
  }

  // Employees endpoints
  async getEmployees(params?: any) {
    const queryParams = new URLSearchParams(params).toString()
    return this.request(`/employees${queryParams ? `?${queryParams}` : ''}`)
  }

  async createEmployee(data: any) {
    return this.request('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateEmployee(id: number, data: any) {
    return this.request(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteEmployee(id: number) {
    return this.request(`/employees/${id}`, {
      method: 'DELETE',
    })
  }

  async getEmployee(id: number) {
    return this.request(`/employees/${id}`)
  }
}

// Create and export a singleton instance
export const apiService = new ApiService()

// Export types for better TypeScript support
export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default apiService

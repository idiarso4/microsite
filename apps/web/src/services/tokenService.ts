// Token management service
export class TokenService {
  private static readonly ACCESS_TOKEN_KEY = 'auth_token'
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token'
  private static readonly TOKEN_EXPIRY_KEY = 'token_expiry'
  private static readonly USER_DATA_KEY = 'user_data'

  // Get access token from localStorage
  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  // Get refresh token from localStorage
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  // Get token expiry time
  static getTokenExpiry(): number | null {
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY)
    return expiry ? parseInt(expiry, 10) : null
  }

  // Get stored user data
  static getUserData(): any | null {
    const userData = localStorage.getItem(this.USER_DATA_KEY)
    return userData ? JSON.parse(userData) : null
  }

  // Store tokens and user data
  static setTokens(accessToken: string, refreshToken?: string, expiresIn?: number, userData?: any): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
    
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
    }

    if (expiresIn) {
      const expiryTime = Date.now() + (expiresIn * 1000) // Convert to milliseconds
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString())
    }

    if (userData) {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData))
    }
  }

  // Clear all tokens and user data
  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY)
    localStorage.removeItem(this.USER_DATA_KEY)
    localStorage.removeItem('demo_mode')
    localStorage.removeItem('demo_user')
  }

  // Check if access token is expired
  static isTokenExpired(): boolean {
    const token = this.getAccessToken()

    // For demo tokens, consider them valid for 24 hours
    if (token && token.startsWith('demo-jwt-token-')) {
      const tokenTimestamp = parseInt(token.replace('demo-jwt-token-', ''))
      const tokenAge = Date.now() - tokenTimestamp
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      return tokenAge > maxAge
    }

    const expiry = this.getTokenExpiry()
    if (!expiry) return true

    // Add 5 minute buffer before actual expiry
    const bufferTime = 5 * 60 * 1000 // 5 minutes in milliseconds
    return Date.now() >= (expiry - bufferTime)
  }

  // Check if we have valid tokens
  static hasValidTokens(): boolean {
    const accessToken = this.getAccessToken()
    return !!accessToken && !this.isTokenExpired()
  }

  // Check if refresh is needed (token expires in next 10 minutes)
  static needsRefresh(): boolean {
    const expiry = this.getTokenExpiry()
    if (!expiry) return false
    
    const refreshThreshold = 10 * 60 * 1000 // 10 minutes in milliseconds
    return Date.now() >= (expiry - refreshThreshold)
  }

  // Decode JWT token (basic implementation)
  static decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  // Get token expiry from JWT
  static getTokenExpiryFromJWT(token: string): number | null {
    const decoded = this.decodeToken(token)
    return decoded?.exp ? decoded.exp * 1000 : null // Convert to milliseconds
  }

  // Validate token format
  static isValidTokenFormat(token: string): boolean {
    if (!token) return false
    const parts = token.split('.')
    return parts.length === 3
  }
}

// Session management service
export class SessionService {
  private static refreshPromise: Promise<boolean> | null = null
  private static logoutCallbacks: (() => void)[] = []

  // Add logout callback
  static addLogoutCallback(callback: () => void): void {
    this.logoutCallbacks.push(callback)
  }

  // Remove logout callback
  static removeLogoutCallback(callback: () => void): void {
    this.logoutCallbacks = this.logoutCallbacks.filter(cb => cb !== callback)
  }

  // Execute all logout callbacks
  private static executeLogoutCallbacks(): void {
    this.logoutCallbacks.forEach(callback => {
      try {
        callback()
      } catch (error) {
        console.error('Error executing logout callback:', error)
      }
    })
  }

  // Refresh access token
  static async refreshToken(): Promise<boolean> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.performTokenRefresh()
    const result = await this.refreshPromise
    this.refreshPromise = null
    
    return result
  }

  private static async performTokenRefresh(): Promise<boolean> {
    try {
      const refreshToken = TokenService.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()
      
      if (data.accessToken) {
        TokenService.setTokens(
          data.accessToken,
          data.refreshToken,
          data.expiresIn,
          data.user
        )
        return true
      }

      throw new Error('Invalid refresh response')
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.logout()
      return false
    }
  }

  // Check and refresh token if needed
  static async ensureValidToken(): Promise<boolean> {
    if (TokenService.hasValidTokens()) {
      // Check if refresh is needed
      if (TokenService.needsRefresh()) {
        return await this.refreshToken()
      }
      return true
    }

    // Try to refresh if we have a refresh token
    const refreshToken = TokenService.getRefreshToken()
    if (refreshToken) {
      return await this.refreshToken()
    }

    // No valid tokens and no refresh token - but don't auto logout
    return false
  }

  // Logout user and clear session
  static logout(): void {
    TokenService.clearTokens()
    this.executeLogoutCallbacks()
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  // Start session monitoring
  static startSessionMonitoring(): void {
    // Check token validity every minute
    const interval = setInterval(async () => {
      const isValid = await this.ensureValidToken()
      if (!isValid) {
        clearInterval(interval)
      }
    }, 60000) // 1 minute

    // Clear interval on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        clearInterval(interval)
      })
    }
  }

  // Handle API response for token expiry
  static handleApiResponse(response: Response): boolean {
    if (response.status === 401) {
      // Token expired or invalid
      this.logout()
      return false
    }
    return true
  }

  // Get session info
  static getSessionInfo(): {
    isValid: boolean
    expiresAt: Date | null
    timeUntilExpiry: number | null
    needsRefresh: boolean
  } {
    const expiry = TokenService.getTokenExpiry()
    const isValid = TokenService.hasValidTokens()
    const needsRefresh = TokenService.needsRefresh()
    
    return {
      isValid,
      expiresAt: expiry ? new Date(expiry) : null,
      timeUntilExpiry: expiry ? expiry - Date.now() : null,
      needsRefresh
    }
  }
}

export default { TokenService, SessionService }

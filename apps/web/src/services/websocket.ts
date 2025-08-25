import { TokenService } from './tokenService'

export interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
  module?: string
}

export interface WebSocketSubscription {
  id: string
  callback: (message: WebSocketMessage) => void
  filter?: (message: WebSocketMessage) => boolean
}

class WebSocketService {
  private ws: WebSocket | null = null
  private subscriptions: Map<string, WebSocketSubscription> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private isConnecting = false
  private url: string

  constructor() {
    // Use environment variable or fallback to localhost
    const wsHost = import.meta.env.VITE_WS_HOST || 'localhost:3001'
    this.url = `ws://${wsHost}/ws`
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'))
        return
      }

      this.isConnecting = true

      try {
        const token = TokenService.getAccessToken()
        const wsUrl = token ? `${this.url}?token=${token}` : this.url
        
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.isConnecting = false
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason)
          this.isConnecting = false
          this.ws = null
          
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect()
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          this.isConnecting = false
          reject(error)
        }

      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
    this.subscriptions.clear()
  }

  private scheduleReconnect() {
    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
    
    setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error)
      })
    }, delay)
  }

  private handleMessage(message: WebSocketMessage) {
    console.log('Received WebSocket message:', message)
    
    this.subscriptions.forEach(subscription => {
      if (!subscription.filter || subscription.filter(message)) {
        try {
          subscription.callback(message)
        } catch (error) {
          console.error('Error in WebSocket subscription callback:', error)
        }
      }
    })
  }

  subscribe(id: string, callback: (message: WebSocketMessage) => void, filter?: (message: WebSocketMessage) => boolean): () => void {
    this.subscriptions.set(id, { id, callback, filter })
    
    // Return unsubscribe function
    return () => {
      this.subscriptions.delete(id)
    }
  }

  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket not connected, cannot send message')
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  getIsConnecting(): boolean {
    return this.isConnecting
  }

  // Convenience methods for common subscriptions
  subscribeToDashboardUpdates(callback: (data: any) => void): () => void {
    return this.subscribe('dashboard-updates', (message) => {
      if (message.type === 'dashboard_update') {
        callback(message.data)
      }
    })
  }

  subscribeToModuleUpdates(module: string, callback: (data: any) => void): () => void {
    return this.subscribe(`${module}-updates`, (message) => {
      if (message.module === module) {
        callback(message.data)
      }
    })
  }

  subscribeToNotifications(callback: (notification: any) => void): () => void {
    return this.subscribe('notifications', (message) => {
      if (message.type === 'notification') {
        callback(message.data)
      }
    })
  }

  subscribeToUserActivity(callback: (activity: any) => void): () => void {
    return this.subscribe('user-activity', (message) => {
      if (message.type === 'user_activity') {
        callback(message.data)
      }
    })
  }

  // Send events to server
  sendUserActivity(activity: string, data?: any) {
    this.send({
      type: 'user_activity',
      activity,
      data,
      timestamp: new Date().toISOString()
    })
  }

  sendHeartbeat() {
    this.send({
      type: 'heartbeat',
      timestamp: new Date().toISOString()
    })
  }
}

// Create singleton instance
export const websocketService = new WebSocketService()

// Auto-connect when user is authenticated
export const initializeWebSocket = async () => {
  const token = TokenService.getAccessToken()
  if (token && !websocketService.isConnected() && !websocketService.getIsConnecting()) {
    try {
      await websocketService.connect()

      // Send heartbeat every 30 seconds
      setInterval(() => {
        if (websocketService.isConnected()) {
          websocketService.sendHeartbeat()
        }
      }, 30000)

    } catch (error) {
      console.error('Failed to initialize WebSocket:', error)
      // Don't retry immediately to avoid spam
    }
  }
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    websocketService.disconnect()
  })
}

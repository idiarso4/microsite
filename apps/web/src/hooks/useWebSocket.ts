import { useEffect, useRef, useState, useCallback } from 'react'
import { websocketService, WebSocketMessage } from '../services/websocket'

export interface UseWebSocketOptions {
  autoConnect?: boolean
  filter?: (message: WebSocketMessage) => boolean
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: any) => void
}

export function useWebSocket(
  subscriptionId: string,
  onMessage: (message: WebSocketMessage) => void,
  options: UseWebSocketOptions = {}
) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const { autoConnect = true, filter, onConnect, onDisconnect, onError } = options

  const connect = useCallback(async () => {
    try {
      await websocketService.connect()
      setIsConnected(true)
      setError(null)
      onConnect?.()
    } catch (err: any) {
      setError(err.message)
      setIsConnected(false)
      onError?.(err)
    }
  }, [onConnect, onError])

  const disconnect = useCallback(() => {
    websocketService.disconnect()
    setIsConnected(false)
    onDisconnect?.()
  }, [onDisconnect])

  const subscribe = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
    }
    
    unsubscribeRef.current = websocketService.subscribe(
      subscriptionId,
      onMessage,
      filter
    )
  }, [subscriptionId, onMessage, filter])

  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [autoConnect, connect])

  useEffect(() => {
    if (isConnected) {
      subscribe()
    }
  }, [isConnected, subscribe])

  const send = useCallback((message: any) => {
    websocketService.send(message)
  }, [])

  return {
    isConnected,
    error,
    connect,
    disconnect,
    send
  }
}

// Specialized hooks for common use cases
export function useDashboardUpdates(onUpdate: (data: any) => void) {
  const [lastUpdate, setLastUpdate] = useState<any>(null)

  useWebSocket('dashboard-updates', (message) => {
    if (message.type === 'dashboard_update') {
      setLastUpdate(message.data)
      onUpdate(message.data)
    }
  })

  return { lastUpdate }
}

export function useModuleUpdates(module: string, onUpdate: (data: any) => void) {
  const [lastUpdate, setLastUpdate] = useState<any>(null)

  useWebSocket(`${module}-updates`, (message) => {
    if (message.module === module) {
      setLastUpdate(message.data)
      onUpdate(message.data)
    }
  })

  return { lastUpdate }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])

  useWebSocket('notifications', (message) => {
    if (message.type === 'notification') {
      setNotifications(prev => [message.data, ...prev].slice(0, 50)) // Keep last 50
    }
  })

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }, [])

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    clearNotifications,
    markAsRead
  }
}

export function useRealTimeData<T>(
  initialData: T,
  updateFilter: (message: WebSocketMessage) => boolean
): [T, (data: T) => void] {
  const [data, setData] = useState<T>(initialData)

  useWebSocket('realtime-data', (message) => {
    if (updateFilter(message)) {
      setData(message.data)
    }
  })

  return [data, setData]
}

export function useUserActivity() {
  const { send } = useWebSocket('user-activity', () => {})

  const trackActivity = useCallback((activity: string, data?: any) => {
    websocketService.sendUserActivity(activity, data)
  }, [])

  return { trackActivity }
}

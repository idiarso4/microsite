import React, { createContext, useContext, useState, useCallback } from 'react'
import {
  Snackbar,
  Alert,
  AlertTitle,
  Slide,
  SlideProps,
  IconButton,
  Box,
  Typography,
  LinearProgress
} from '@mui/material'
import {
  Close,
  CheckCircle,
  Error,
  Warning,
  Info,
  CloudUpload,
  CloudDownload
} from '@mui/icons-material'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

export interface ToastOptions {
  type: ToastType
  title?: string
  message: string
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    onClick: () => void
  }
  progress?: number
  onClose?: () => void
}

interface Toast extends ToastOptions {
  id: string
  timestamp: number
}

interface ToastContextType {
  showToast: (options: ToastOptions) => string
  hideToast: (id: string) => void
  updateToast: (id: string, options: Partial<ToastOptions>) => void
  clearAllToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((options: ToastOptions): string => {
    const id = Math.random().toString(36).substring(7)
    const toast: Toast = {
      ...options,
      id,
      timestamp: Date.now(),
      duration: options.duration ?? (options.type === 'error' ? 6000 : 4000)
    }

    setToasts(prev => [...prev, toast])

    // Auto-hide non-persistent toasts
    if (!options.persistent && options.type !== 'loading') {
      setTimeout(() => {
        hideToast(id)
      }, toast.duration)
    }

    return id
  }, [])

  const hideToast = useCallback((id: string) => {
    setToasts(prev => {
      const toast = prev.find(t => t.id === id)
      if (toast?.onClose) {
        toast.onClose()
      }
      return prev.filter(t => t.id !== id)
    })
  }, [])

  const updateToast = useCallback((id: string, options: Partial<ToastOptions>) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...options } : toast
    ))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle />
      case 'error':
        return <Error />
      case 'warning':
        return <Warning />
      case 'info':
        return <Info />
      case 'loading':
        return <CloudUpload />
      default:
        return <Info />
    }
  }

  const getSeverity = (type: ToastType) => {
    if (type === 'loading') return 'info'
    return type
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast, updateToast, clearAllToasts }}>
      {children}
      
      {/* Render toasts */}
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            bottom: 16 + (index * 80), // Stack toasts
            zIndex: 1400 + index
          }}
        >
          <Alert
            severity={getSeverity(toast.type)}
            icon={getIcon(toast.type)}
            action={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {toast.action && (
                  <IconButton
                    size="small"
                    onClick={toast.action.onClick}
                    sx={{ color: 'inherit' }}
                  >
                    <Typography variant="button" sx={{ fontSize: '0.75rem' }}>
                      {toast.action.label}
                    </Typography>
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  onClick={() => hideToast(toast.id)}
                  sx={{ color: 'inherit' }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            }
            sx={{
              minWidth: 300,
              maxWidth: 500,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            {toast.title && (
              <AlertTitle sx={{ mb: 1 }}>
                {toast.title}
              </AlertTitle>
            )}
            
            <Typography variant="body2">
              {toast.message}
            </Typography>

            {/* Progress bar for loading toasts */}
            {toast.type === 'loading' && toast.progress !== undefined && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={toast.progress}
                  sx={{ height: 4, borderRadius: 2 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {Math.round(toast.progress)}% complete
                </Typography>
              </Box>
            )}

            {toast.type === 'loading' && toast.progress === undefined && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress sx={{ height: 4, borderRadius: 2 }} />
              </Box>
            )}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new globalThis.Error('useToast must be used within a ToastProvider')
  }

  const { showToast, hideToast, updateToast, clearAllToasts } = context

  // Convenience methods
  const success = useCallback((message: string, options?: Partial<ToastOptions>) => {
    return showToast({ type: 'success', message, ...options })
  }, [showToast])

  const error = useCallback((message: string, options?: Partial<ToastOptions>) => {
    return showToast({ type: 'error', message, ...options })
  }, [showToast])

  const warning = useCallback((message: string, options?: Partial<ToastOptions>) => {
    return showToast({ type: 'warning', message, ...options })
  }, [showToast])

  const info = useCallback((message: string, options?: Partial<ToastOptions>) => {
    return showToast({ type: 'info', message, ...options })
  }, [showToast])

  const loading = useCallback((message: string, options?: Partial<ToastOptions>) => {
    return showToast({ type: 'loading', message, persistent: true, ...options })
  }, [showToast])

  // Promise-based operations
  const promise = useCallback(async <T,>(
    promise: Promise<T>,
    {
      loading: loadingMessage = 'Loading...',
      success: successMessage = 'Operation completed successfully',
      error: errorMessage = 'Operation failed'
    }: {
      loading?: string
      success?: string | ((data: T) => string)
      error?: string | ((error: any) => string)
    } = {}
  ): Promise<T> => {
    const toastId = loading(loadingMessage)

    try {
      const result = await promise
      hideToast(toastId)
      
      const message = typeof successMessage === 'function' 
        ? successMessage(result) 
        : successMessage
      success(message)
      
      return result
    } catch (err: any) {
      hideToast(toastId)
      
      const message = typeof errorMessage === 'function' 
        ? errorMessage(err) 
        : errorMessage
      error(message)
      
      throw err
    }
  }, [showToast, hideToast, success, error, loading])

  return {
    showToast,
    hideToast,
    updateToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
    loading,
    promise
  }
}

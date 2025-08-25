import React, { useState } from 'react'
import {
  Box,
  IconButton,
  Badge,
  Popover,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Button,
  Divider,
  Tooltip
} from '@mui/material'
import {
  Notifications,
  NotificationsActive,
  Circle,
  CheckCircle,
  Info,
  Warning,
  Error,
  Clear,
  MarkEmailRead
} from '@mui/icons-material'
import { useNotifications } from '../../hooks/useWebSocket'

interface NotificationCenterProps {
  maxHeight?: number
}

export default function NotificationCenter({ maxHeight = 400 }: NotificationCenterProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { notifications, unreadCount, markAsRead, clearNotifications } = useNotifications()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  const handleMarkAllAsRead = () => {
    notifications.forEach(notif => {
      if (!notif.read) {
        markAsRead(notif.id)
      }
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle sx={{ color: '#4CAF50' }} />
      case 'warning':
        return <Warning sx={{ color: '#FF9800' }} />
      case 'error':
        return <Error sx={{ color: '#f44336' }} />
      case 'info':
      default:
        return <Info sx={{ color: '#2196F3' }} />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#4CAF50'
      case 'warning':
        return '#FF9800'
      case 'error':
        return '#f44336'
      case 'info':
      default:
        return '#2196F3'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          onClick={handleClick}
          sx={{
            color: unreadCount > 0 ? '#DC143C' : 'inherit',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <Badge badgeContent={unreadCount} color="error" max={99}>
            {unreadCount > 0 ? <NotificationsActive /> : <Notifications />}
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ width: 380, maxHeight }}>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Notifications
                {unreadCount > 0 && (
                  <Chip
                    label={unreadCount}
                    size="small"
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {unreadCount > 0 && (
                  <Button
                    size="small"
                    startIcon={<MarkEmailRead />}
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  size="small"
                  startIcon={<Clear />}
                  onClick={clearNotifications}
                  color="error"
                >
                  Clear all
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Notifications List */}
          <Box sx={{ maxHeight: maxHeight - 100, overflow: 'auto' }}>
            {notifications.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Notifications sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No notifications yet
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id || index}>
                    <ListItem
                      sx={{
                        bgcolor: notification.read ? 'transparent' : 'action.hover',
                        '&:hover': { bgcolor: 'action.selected' },
                        cursor: 'pointer'
                      }}
                      onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                    >
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: getNotificationColor(notification.type || 'info')
                          }}
                        >
                          {getNotificationIcon(notification.type || 'info')}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: notification.read ? 'normal' : 'bold',
                                flex: 1
                              }}
                            >
                              {notification.title || notification.message}
                            </Typography>
                            {!notification.read && (
                              <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            {notification.description && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                {notification.description}
                              </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(notification.timestamp || new Date().toISOString())} • {notification.module || 'System'}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        {!notification.read && (
                          <Tooltip title="Mark as read">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(notification.id)
                              }}
                            >
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Paper>
      </Popover>
    </>
  )
}

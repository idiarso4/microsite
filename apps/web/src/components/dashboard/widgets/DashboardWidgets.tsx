import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  Paper,
  Stack
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  MoreVert,
  Circle,
  CheckCircle,
  Warning,
  Error,
  Info
} from '@mui/icons-material'

// Metric Widget
interface MetricWidgetProps {
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  color: string
  subtitle?: string
  onClick?: () => void
}

export const MetricWidget: React.FC<MetricWidgetProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  color,
  subtitle,
  onClick
}) => {
  return (
    <Card
      sx={{
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        border: `1px solid ${color}20`,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: `0 6px 20px ${color}20`
        } : {},
        transition: 'all 0.3s ease'
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box flex={1}>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color, mb: 1 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {change !== undefined && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend === 'up' && <TrendingUp sx={{ color: '#4CAF50', fontSize: 16, mr: 0.5 }} />}
                {trend === 'down' && <TrendingDown sx={{ color: '#f44336', fontSize: 16, mr: 0.5 }} />}
                <Typography
                  variant="body2"
                  sx={{
                    color: trend === 'up' ? '#4CAF50' : trend === 'down' ? '#f44336' : 'text.secondary',
                    fontWeight: 'medium'
                  }}
                >
                  {change > 0 ? '+' : ''}{change}%
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              backgroundColor: `${color}15`,
              color,
              width: 56,
              height: 56
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )
}

// Progress Widget
interface ProgressWidgetProps {
  title: string
  value: number
  max: number
  color?: string
  subtitle?: string
  showPercentage?: boolean
}

export const ProgressWidget: React.FC<ProgressWidgetProps> = ({
  title,
  value,
  max,
  color = '#DC143C',
  subtitle,
  showPercentage = true
}) => {
  const percentage = Math.round((value / max) * 100)

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {subtitle}
          </Typography>
        )}
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mr: 1 }}>
            {showPercentage ? `${percentage}%` : value.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {showPercentage ? `of ${max.toLocaleString()}` : `/ ${max.toLocaleString()}`}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: `${color}20`,
            '& .MuiLinearProgress-bar': {
              backgroundColor: color
            }
          }}
        />
      </CardContent>
    </Card>
  )
}

// Activity Widget
interface ActivityItem {
  id: string | number
  title: string
  subtitle?: string
  time: string
  icon: React.ReactNode
  color?: string
}

interface ActivityWidgetProps {
  title: string
  activities: ActivityItem[]
  maxItems?: number
}

export const ActivityWidget: React.FC<ActivityWidgetProps> = ({
  title,
  activities,
  maxItems = 5
}) => {
  const displayActivities = activities.slice(0, maxItems)

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>
        <List dense>
          {displayActivities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: activity.color || '#DC143C' 
                    }}
                  >
                    {activity.icon}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={activity.title}
                  secondary={
                    <Box>
                      {activity.subtitle && (
                        <Typography variant="caption" display="block">
                          {activity.subtitle}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  }
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              {index < displayActivities.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

// Status Widget
interface StatusItem {
  label: string
  value: number
  color: string
  icon?: React.ReactNode
}

interface StatusWidgetProps {
  title: string
  items: StatusItem[]
  total?: number
}

export const StatusWidget: React.FC<StatusWidgetProps> = ({
  title,
  items,
  total
}) => {
  const calculatedTotal = total || items.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Stack spacing={2}>
          {items.map((item, index) => {
            const percentage = calculatedTotal > 0 ? (item.value / calculatedTotal) * 100 : 0
            return (
              <Box key={index}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center">
                    {item.icon && (
                      <Box sx={{ mr: 1, color: item.color }}>
                        {item.icon}
                      </Box>
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {item.value}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: `${item.color}20`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: item.color
                    }
                  }}
                />
              </Box>
            )
          })}
        </Stack>
      </CardContent>
    </Card>
  )
}

// Alert Widget
interface AlertItem {
  id: string | number
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  time?: string
}

interface AlertWidgetProps {
  title: string
  alerts: AlertItem[]
  maxItems?: number
}

export const AlertWidget: React.FC<AlertWidgetProps> = ({
  title,
  alerts,
  maxItems = 3
}) => {
  const displayAlerts = alerts.slice(0, maxItems)

  const getAlertIcon = (type: AlertItem['type']) => {
    switch (type) {
      case 'success': return <CheckCircle />
      case 'warning': return <Warning />
      case 'error': return <Error />
      case 'info': return <Info />
      default: return <Circle />
    }
  }

  const getAlertColor = (type: AlertItem['type']) => {
    switch (type) {
      case 'success': return '#4CAF50'
      case 'warning': return '#FF9800'
      case 'error': return '#f44336'
      case 'info': return '#2196F3'
      default: return '#757575'
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Stack spacing={2}>
          {displayAlerts.map((alert) => (
            <Paper
              key={alert.id}
              sx={{
                p: 2,
                border: `1px solid ${getAlertColor(alert.type)}30`,
                backgroundColor: `${getAlertColor(alert.type)}05`
              }}
            >
              <Box display="flex" alignItems="flex-start">
                <Box sx={{ color: getAlertColor(alert.type), mr: 1, mt: 0.5 }}>
                  {getAlertIcon(alert.type)}
                </Box>
                <Box flex={1}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {alert.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {alert.message}
                  </Typography>
                  {alert.time && (
                    <Typography variant="caption" color="text.secondary">
                      {alert.time}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

// Quick Action Widget
interface QuickAction {
  title: string
  icon: React.ReactNode
  color: string
  onClick: () => void
}

interface QuickActionWidgetProps {
  title: string
  actions: QuickAction[]
}

export const QuickActionWidget: React.FC<QuickActionWidgetProps> = ({
  title,
  actions
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          {title}
        </Typography>
        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid item xs={6} key={index}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: `1px solid ${action.color}20`,
                  '&:hover': {
                    backgroundColor: `${action.color}10`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${action.color}20`
                  },
                  transition: 'all 0.3s ease'
                }}
                onClick={action.onClick}
              >
                <Avatar
                  sx={{
                    backgroundColor: `${action.color}15`,
                    color: action.color,
                    width: 48,
                    height: 48,
                    mx: 'auto',
                    mb: 1
                  }}
                >
                  {action.icon}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {action.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

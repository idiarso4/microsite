import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'
import {
  MoreVert,
  Download,
  Fullscreen,
  Refresh,
  Settings
} from '@mui/icons-material'

export interface ChartData {
  [key: string]: any
}

export interface ReportChartProps {
  title: string
  subtitle?: string
  type: 'bar' | 'line' | 'pie' | 'area'
  data: ChartData[]
  xAxisKey?: string
  yAxisKey?: string
  colorScheme?: string[]
  loading?: boolean
  error?: string
  height?: number
  showLegend?: boolean
  showGrid?: boolean
  onRefresh?: () => void
  onExport?: (format: 'png' | 'pdf' | 'csv') => void
  onFullscreen?: () => void
}

const defaultColors = [
  '#DC143C', '#1A1A1A', '#4CAF50', '#FF9800', '#2196F3',
  '#9C27B0', '#607D8B', '#795548', '#E91E63', '#00BCD4'
]

export default function ReportChart({
  title,
  subtitle,
  type,
  data,
  xAxisKey = 'name',
  yAxisKey = 'value',
  colorScheme = defaultColors,
  loading = false,
  error,
  height = 400,
  showLegend = true,
  showGrid = true,
  onRefresh,
  onExport,
  onFullscreen
}: ReportChartProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleExport = (format: 'png' | 'pdf' | 'csv') => {
    handleMenuClose()
    onExport?.(format)
  }

  const formatTooltipValue = (value: any, name: string) => {
    if (typeof value === 'number') {
      return [value.toLocaleString(), name]
    }
    return [value, name]
  }

  const renderChart = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
          <Typography>Loading chart...</Typography>
        </Box>
      )
    }

    if (error) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )
    }

    if (!data || data.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
          <Typography color="text.secondary">No data available</Typography>
        </Box>
      )
    }

    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    }

    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <RechartsTooltip formatter={formatTooltipValue} />
              {showLegend && <Legend />}
              <Bar dataKey={yAxisKey} fill={colorScheme[0]} />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <RechartsTooltip formatter={formatTooltipValue} />
              {showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey={yAxisKey} 
                stroke={colorScheme[0]} 
                strokeWidth={2}
                dot={{ fill: colorScheme[0] }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <RechartsTooltip formatter={formatTooltipValue} />
              {showLegend && <Legend />}
              <Area 
                type="monotone" 
                dataKey={yAxisKey} 
                stroke={colorScheme[0]} 
                fill={colorScheme[0]}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                dataKey={yAxisKey}
                nameKey={xAxisKey}
                cx="50%"
                cy="50%"
                outerRadius={Math.min(height * 0.35, 120)}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorScheme[index % colorScheme.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={formatTooltipValue} />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return <Typography>Unsupported chart type: {type}</Typography>
    }
  }

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={type.toUpperCase()} 
              size="small" 
              variant="outlined"
              color="primary"
            />
            
            {onRefresh && (
              <Tooltip title="Refresh">
                <IconButton size="small" onClick={onRefresh}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            )}
            
            {onFullscreen && (
              <Tooltip title="Fullscreen">
                <IconButton size="small" onClick={onFullscreen}>
                  <Fullscreen />
                </IconButton>
              </Tooltip>
            )}
            
            <IconButton size="small" onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Chart Content */}
      <Box sx={{ p: 2 }}>
        {renderChart()}
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleExport('png')}>
          <Download sx={{ mr: 1 }} />
          Export as PNG
        </MenuItem>
        <MenuItem onClick={() => handleExport('pdf')}>
          <Download sx={{ mr: 1 }} />
          Export as PDF
        </MenuItem>
        <MenuItem onClick={() => handleExport('csv')}>
          <Download sx={{ mr: 1 }} />
          Export Data (CSV)
        </MenuItem>
      </Menu>
    </Paper>
  )
}

// Sample data generator for testing
export const generateSampleData = (type: 'monthly' | 'category' | 'trend', count = 12) => {
  const data: ChartData[] = []
  
  switch (type) {
    case 'monthly':
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      for (let i = 0; i < count; i++) {
        data.push({
          name: months[i % 12],
          value: Math.floor(Math.random() * 100000) + 10000,
          revenue: Math.floor(Math.random() * 50000000) + 5000000,
          orders: Math.floor(Math.random() * 500) + 50
        })
      }
      break
      
    case 'category':
      const categories = ['Electronics', 'Furniture', 'Office Supplies', 'Software', 'Services']
      categories.forEach(category => {
        data.push({
          name: category,
          value: Math.floor(Math.random() * 50) + 10,
          revenue: Math.floor(Math.random() * 20000000) + 2000000
        })
      })
      break
      
    case 'trend':
      for (let i = 0; i < count; i++) {
        data.push({
          name: `Week ${i + 1}`,
          value: Math.floor(Math.random() * 1000) + 100 + (i * 10), // Trending up
          target: 500 + (i * 15)
        })
      }
      break
  }
  
  return data
}

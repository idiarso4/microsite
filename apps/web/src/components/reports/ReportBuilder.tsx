import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput
} from '@mui/material'
import {
  Add,
  Remove,
  BarChart,
  PieChart,
  ShowChart,
  TableChart,
  Assessment,
  FilterList,
  DateRange,
  Download,
  Preview,
  Save,
  Schedule
} from '@mui/icons-material'

export interface ReportField {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'enum'
  label: string
  table: string
}

export interface ReportFilter {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in'
  value: any
  label?: string
}

export interface ReportConfig {
  name: string
  description?: string
  type: 'table' | 'chart' | 'summary'
  chartType?: 'bar' | 'line' | 'pie' | 'area'
  fields: string[]
  filters: ReportFilter[]
  groupBy?: string[]
  orderBy?: { field: string; direction: 'asc' | 'desc' }[]
  dateRange?: {
    start: string
    end: string
    field: string
  }
}

interface ReportBuilderProps {
  availableFields: ReportField[]
  onSave: (config: ReportConfig) => void
  onPreview: (config: ReportConfig) => void
  onSchedule?: (config: ReportConfig, schedule: any) => void
  initialConfig?: ReportConfig
}

export default function ReportBuilder({
  availableFields,
  onSave,
  onPreview,
  onSchedule,
  initialConfig
}: ReportBuilderProps) {
  const [config, setConfig] = useState<ReportConfig>(initialConfig || {
    name: '',
    description: '',
    type: 'table',
    fields: [],
    filters: [],
    groupBy: [],
    orderBy: []
  })

  const [selectedFields, setSelectedFields] = useState<string[]>(config.fields)

  const handleFieldToggle = (fieldId: string) => {
    const newFields = selectedFields.includes(fieldId)
      ? selectedFields.filter(id => id !== fieldId)
      : [...selectedFields, fieldId]
    
    setSelectedFields(newFields)
    setConfig(prev => ({ ...prev, fields: newFields }))
  }

  const addFilter = () => {
    const newFilter: ReportFilter = {
      field: '',
      operator: 'equals',
      value: ''
    }
    setConfig(prev => ({
      ...prev,
      filters: [...prev.filters, newFilter]
    }))
  }

  const updateFilter = (index: number, updates: Partial<ReportFilter>) => {
    setConfig(prev => ({
      ...prev,
      filters: prev.filters.map((filter, i) => 
        i === index ? { ...filter, ...updates } : filter
      )
    }))
  }

  const removeFilter = (index: number) => {
    setConfig(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index)
    }))
  }

  const getFieldsByTable = () => {
    const tables: { [key: string]: ReportField[] } = {}
    availableFields.forEach(field => {
      if (!tables[field.table]) {
        tables[field.table] = []
      }
      tables[field.table].push(field)
    })
    return tables
  }

  const getFieldLabel = (fieldId: string) => {
    const field = availableFields.find(f => f.id === fieldId)
    return field ? field.label : fieldId
  }

  const reportTypes = [
    { value: 'table', label: 'Data Table', icon: <TableChart /> },
    { value: 'chart', label: 'Chart', icon: <BarChart /> },
    { value: 'summary', label: 'Summary', icon: <Assessment /> }
  ]

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: <BarChart /> },
    { value: 'line', label: 'Line Chart', icon: <ShowChart /> },
    { value: 'pie', label: 'Pie Chart', icon: <PieChart /> },
    { value: 'area', label: 'Area Chart', icon: <ShowChart /> }
  ]

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'between', label: 'Between' },
    { value: 'in', label: 'In List' },
    { value: 'not_in', label: 'Not In List' }
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Report Builder
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Create custom reports with advanced filtering and visualization options
      </Typography>

      <Grid container spacing={3}>
        {/* Report Configuration */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              Report Configuration
            </Typography>

            <TextField
              fullWidth
              label="Report Name"
              value={config.name}
              onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={config.description}
              onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={config.type}
                onChange={(e) => setConfig(prev => ({ ...prev, type: e.target.value as any }))}
                label="Report Type"
              >
                {reportTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {type.icon}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {config.type === 'chart' && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Chart Type</InputLabel>
                <Select
                  value={config.chartType || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, chartType: e.target.value as any }))}
                  label="Chart Type"
                >
                  {chartTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {type.icon}
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Preview />}
                onClick={() => onPreview(config)}
                disabled={!config.name || selectedFields.length === 0}
                sx={{ bgcolor: '#DC143C', '&:hover': { bgcolor: '#B91C3C' } }}
              >
                Preview
              </Button>
              <Button
                variant="outlined"
                startIcon={<Save />}
                onClick={() => onSave(config)}
                disabled={!config.name || selectedFields.length === 0}
              >
                Save
              </Button>
              {onSchedule && (
                <Button
                  variant="outlined"
                  startIcon={<Schedule />}
                  onClick={() => onSchedule(config, {})}
                  disabled={!config.name || selectedFields.length === 0}
                >
                  Schedule
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Field Selection */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, maxHeight: 600, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Select Fields
            </Typography>
            
            {Object.entries(getFieldsByTable()).map(([table, fields]) => (
              <Box key={table} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {table}
                </Typography>
                <List dense>
                  {fields.map(field => (
                    <ListItem key={field.id} sx={{ py: 0 }}>
                      <ListItemIcon>
                        <Checkbox
                          checked={selectedFields.includes(field.id)}
                          onChange={() => handleFieldToggle(field.id)}
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={field.label}
                        secondary={field.type}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Filters */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, maxHeight: 600, overflow: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Filters
              </Typography>
              <Button
                size="small"
                startIcon={<Add />}
                onClick={addFilter}
              >
                Add Filter
              </Button>
            </Box>

            {config.filters.map((filter, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ pb: 1 }}>
                  <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                    <InputLabel>Field</InputLabel>
                    <Select
                      value={filter.field}
                      onChange={(e) => updateFilter(index, { field: e.target.value })}
                      label="Field"
                    >
                      {availableFields.map(field => (
                        <MenuItem key={field.id} value={field.id}>
                          {field.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                    <InputLabel>Operator</InputLabel>
                    <Select
                      value={filter.operator}
                      onChange={(e) => updateFilter(index, { operator: e.target.value as any })}
                      label="Operator"
                    >
                      {operators.map(op => (
                        <MenuItem key={op.value} value={op.value}>
                          {op.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    size="small"
                    label="Value"
                    value={filter.value}
                    onChange={(e) => updateFilter(index, { value: e.target.value })}
                  />
                </CardContent>
                <CardActions sx={{ pt: 0 }}>
                  <IconButton
                    size="small"
                    onClick={() => removeFilter(index)}
                    color="error"
                  >
                    <Remove />
                  </IconButton>
                </CardActions>
              </Card>
            ))}

            {config.filters.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No filters added. Click "Add Filter" to create one.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Selected Fields Preview */}
      {selectedFields.length > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Selected Fields ({selectedFields.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {selectedFields.map(fieldId => (
              <Chip
                key={fieldId}
                label={getFieldLabel(fieldId)}
                onDelete={() => handleFieldToggle(fieldId)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  )
}

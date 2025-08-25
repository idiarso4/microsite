import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Chip,
  IconButton,
  Collapse,
  Divider,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText
} from '@mui/material'
import {
  FilterList,
  ExpandMore,
  ExpandLess,
  Clear,
  Search,
  Refresh
} from '@mui/icons-material'

export interface FilterField {
  id: string
  label: string
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number'
  options?: Array<{ value: string | number; label: string }>
  placeholder?: string
  min?: number
  max?: number
}

export interface FilterValue {
  [key: string]: any
}

export interface AdvancedFilterProps {
  fields: FilterField[]
  values: FilterValue
  onChange: (values: FilterValue) => void
  onSearch: () => void
  onReset: () => void
  searchTerm: string
  onSearchChange: (term: string) => void
  loading?: boolean
  collapsible?: boolean
  title?: string
}

export default function AdvancedFilter({
  fields,
  values,
  onChange,
  onSearch,
  onReset,
  searchTerm,
  onSearchChange,
  loading = false,
  collapsible = true,
  title = 'Advanced Filters'
}: AdvancedFilterProps) {
  const [expanded, setExpanded] = useState(false)

  const handleFieldChange = (fieldId: string, value: any) => {
    onChange({
      ...values,
      [fieldId]: value
    })
  }

  const handleClearField = (fieldId: string) => {
    const newValues = { ...values }
    delete newValues[fieldId]
    onChange(newValues)
  }

  const getActiveFiltersCount = () => {
    return Object.keys(values).filter(key => {
      const value = values[key]
      if (Array.isArray(value)) return value.length > 0
      return value !== undefined && value !== null && value !== ''
    }).length
  }

  const renderField = (field: FilterField) => {
    const value = values[field.id]

    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            size="small"
            InputProps={{
              endAdornment: value && (
                <IconButton
                  size="small"
                  onClick={() => handleClearField(field.id)}
                >
                  <Clear fontSize="small" />
                </IconButton>
              )
            }}
          />
        )

      case 'select':
        return (
          <TextField
            select
            fullWidth
            label={field.label}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )

      case 'multiselect':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{field.label}</InputLabel>
            <Select
              multiple
              value={value || []}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              input={<OutlinedInput label={field.label} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((val) => {
                    const option = field.options?.find(opt => opt.value === val)
                    return (
                      <Chip
                        key={val}
                        label={option?.label || val}
                        size="small"
                        onDelete={() => {
                          const newValue = (value || []).filter((v: any) => v !== val)
                          handleFieldChange(field.id, newValue)
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    )
                  })}
                </Box>
              )}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Checkbox checked={(value || []).indexOf(option.value) > -1} />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value ? Number(e.target.value) : '')}
            size="small"
            inputProps={{
              min: field.min,
              max: field.max
            }}
            InputProps={{
              endAdornment: value && (
                <IconButton
                  size="small"
                  onClick={() => handleClearField(field.id)}
                >
                  <Clear fontSize="small" />
                </IconButton>
              )
            }}
          />
        )

      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            label={field.label}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              endAdornment: value && (
                <IconButton
                  size="small"
                  onClick={() => handleClearField(field.id)}
                >
                  <Clear fontSize="small" />
                </IconButton>
              )
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <Paper sx={{ mb: 3, overflow: 'hidden' }}>
      {/* Search Bar */}
      <Box sx={{ p: 2, pb: collapsible ? 1 : 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: searchTerm && (
                  <IconButton
                    size="small"
                    onClick={() => onSearchChange('')}
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#DC143C',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#DC143C',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={onSearch}
                disabled={loading}
                startIcon={<Search />}
                sx={{
                  bgcolor: '#DC143C',
                  '&:hover': { bgcolor: '#B91C3C' }
                }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={onReset}
                disabled={loading}
                startIcon={<Refresh />}
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Advanced Filters */}
      {collapsible && (
        <>
          <Divider />
          <Box
            sx={{
              p: 2,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              '&:hover': { bgcolor: 'action.hover' }
            }}
            onClick={() => setExpanded(!expanded)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList />
              <Typography variant="subtitle2">
                {title}
                {getActiveFiltersCount() > 0 && (
                  <Chip
                    label={getActiveFiltersCount()}
                    size="small"
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
            </Box>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </Box>
        </>
      )}

      <Collapse in={!collapsible || expanded}>
        <Box sx={{ p: 2, pt: collapsible ? 0 : 2 }}>
          <Grid container spacing={2}>
            {fields.map((field) => (
              <Grid item xs={12} sm={6} md={4} key={field.id}>
                {renderField(field)}
              </Grid>
            ))}
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  )
}

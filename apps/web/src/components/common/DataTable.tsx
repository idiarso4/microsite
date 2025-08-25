import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Box,
  Chip,
  Avatar,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Print,
  Download,
  Add,
  Refresh,
  ArrowUpward,
  ArrowDownward,
  Sort
} from '@mui/icons-material'

export interface Column {
  id: string
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
  format?: (value: any, row: any) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
  type?: 'text' | 'number' | 'date' | 'boolean' | 'enum'
}

export interface DataTableProps {
  title: string
  columns: Column[]
  data: any[]
  loading?: boolean
  error?: string | null
  onAdd?: () => void
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  onView?: (row: any) => void
  onPrint?: (rows: any[]) => void
  onExport?: (rows: any[]) => void
  onRefresh?: () => void
  searchable?: boolean
  selectable?: boolean
  actions?: boolean
  customActions?: Array<{
    icon: React.ReactNode
    label: string
    onClick: (row: any) => void
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  }>
  rowsPerPageOptions?: number[]
  defaultRowsPerPage?: number
  emptyMessage?: string
  dense?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (column: string, order: 'asc' | 'desc') => void
  enableAdvancedSearch?: boolean
}

export default function DataTable({
  title,
  columns,
  data,
  loading = false,
  error = null,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onPrint,
  onExport,
  onRefresh,
  searchable = true,
  selectable = false,
  actions = true,
  customActions = [],
  rowsPerPageOptions = [5, 10, 25, 50],
  defaultRowsPerPage = 10,
  emptyMessage = 'No data available',
  dense = false,
  sortBy,
  sortOrder = 'asc',
  onSort,
  enableAdvancedSearch = false
}: DataTableProps) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)
  const [searchTerm, setSearchTerm] = useState('')
  const [selected, setSelected] = useState<any[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null)
  const [filteredData, setFilteredData] = useState(data)
  const [localSortBy, setLocalSortBy] = useState(sortBy || '')
  const [localSortOrder, setLocalSortOrder] = useState<'asc' | 'desc'>(sortOrder)

  useEffect(() => {
    let filtered = [...data]

    // Filter data based on search term
    if (searchTerm) {
      filtered = filtered.filter(row =>
        columns.some(column => {
          if (!column.searchable && !column.filterable) return false
          const value = row[column.id]
          if (value === null || value === undefined) return false

          // Enhanced search based on column type
          const searchLower = searchTerm.toLowerCase()
          const valueStr = value.toString().toLowerCase()

          if (column.type === 'number') {
            return valueStr.includes(searchLower) || value === Number(searchTerm)
          } else if (column.type === 'date') {
            const dateStr = new Date(value).toLocaleDateString().toLowerCase()
            return dateStr.includes(searchLower)
          } else {
            return valueStr.includes(searchLower)
          }
        })
      )
    }

    // Sort data if local sorting is enabled
    if (localSortBy && !onSort) {
      filtered.sort((a, b) => {
        const aVal = a[localSortBy]
        const bVal = b[localSortBy]

        if (aVal === null || aVal === undefined) return 1
        if (bVal === null || bVal === undefined) return -1

        let comparison = 0
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal
        } else if (aVal instanceof Date && bVal instanceof Date) {
          comparison = aVal.getTime() - bVal.getTime()
        } else {
          comparison = aVal.toString().localeCompare(bVal.toString())
        }

        return localSortOrder === 'desc' ? -comparison : comparison
      })
    }

    setFilteredData(filtered)
    setPage(0) // Reset to first page when filtering
  }, [data, searchTerm, columns, localSortBy, localSortOrder, onSort])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleSort = (columnId: string) => {
    const column = columns.find(col => col.id === columnId)
    if (!column?.sortable) return

    if (onSort) {
      // External sorting
      const newOrder = sortBy === columnId && sortOrder === 'asc' ? 'desc' : 'asc'
      onSort(columnId, newOrder)
    } else {
      // Local sorting
      const newOrder = localSortBy === columnId && localSortOrder === 'asc' ? 'desc' : 'asc'
      setLocalSortBy(columnId)
      setLocalSortOrder(newOrder)
    }
  }

  const getSortIcon = (columnId: string) => {
    const currentSortBy = onSort ? sortBy : localSortBy
    const currentSortOrder = onSort ? sortOrder : localSortOrder

    if (currentSortBy !== columnId) {
      return <Sort sx={{ opacity: 0.5 }} />
    }

    return currentSortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      setSelected(newSelected)
    } else {
      setSelected([])
    }
  }

  const handleRowClick = (event: React.MouseEvent<unknown>, row: any) => {
    if (!selectable) return
    
    const selectedIndex = selected.findIndex(item => item.id === row.id)
    let newSelected: any[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const isSelected = (row: any) => selected.findIndex(item => item.id === row.id) !== -1

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedRow(null)
  }

  const handleAction = (action: () => void) => {
    action()
    handleMenuClose()
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    )
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Toolbar */}
      <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          component="div"
        >
          {title}
        </Typography>

        {/* Search */}
        {searchable && (
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2, minWidth: 200 }}
          />
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onRefresh && (
            <Tooltip title="Refresh">
              <IconButton onClick={onRefresh} disabled={loading}>
                <Refresh />
              </IconButton>
            </Tooltip>
          )}
          
          {selected.length > 0 && onPrint && (
            <Tooltip title="Print Selected">
              <IconButton onClick={() => onPrint(selected)}>
                <Print />
              </IconButton>
            </Tooltip>
          )}
          
          {selected.length > 0 && onExport && (
            <Tooltip title="Export Selected">
              <IconButton onClick={() => onExport(selected)}>
                <Download />
              </IconButton>
            </Tooltip>
          )}

          {selected.length > 0 && (
            <Tooltip title="Export Options">
              <IconButton onClick={(e) => setExportMenuAnchor(e.currentTarget)}>
                <MoreVert />
              </IconButton>
            </Tooltip>
          )}
          
          {onAdd && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAdd}
              sx={{
                background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                }
              }}
            >
              Add New
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Table */}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table" size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < rowsPerPage}
                    checked={rowsPerPage > 0 && selected.length === rowsPerPage}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    fontWeight: 'bold',
                    cursor: column.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    '&:hover': column.sortable ? { bgcolor: 'action.hover' } : {}
                  }}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {column.label}
                    {column.sortable && (
                      <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.7 }}>
                        {getSortIcon(column.id)}
                      </Box>
                    )}
                  </Box>
                </TableCell>
              ))}
              {actions && (
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} align="center">
                  <Box sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleRowClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id || index}
                      selected={isItemSelected}
                      sx={{ cursor: selectable ? 'pointer' : 'default' }}
                    >
                      {selectable && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => {
                        const value = row[column.id]
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format ? column.format(value, row) : value}
                          </TableCell>
                        )
                      })}
                      {actions && (
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMenuOpen(e, row)
                            }}
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {onView && (
          <MenuItem onClick={() => handleAction(() => onView(selectedRow))}>
            <Visibility sx={{ mr: 1 }} />
            View
          </MenuItem>
        )}
        {onEdit && (
          <MenuItem onClick={() => handleAction(() => onEdit(selectedRow))}>
            <Edit sx={{ mr: 1 }} />
            Edit
          </MenuItem>
        )}
        {customActions.map((action, index) => (
          <MenuItem key={index} onClick={() => handleAction(() => action.onClick(selectedRow))}>
            {action.icon}
            <span style={{ marginLeft: 8 }}>{action.label}</span>
          </MenuItem>
        ))}
        {onDelete && (
          <MenuItem onClick={() => handleAction(() => onDelete(selectedRow))} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </Paper>
  )
}

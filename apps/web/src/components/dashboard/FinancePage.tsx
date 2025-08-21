import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  AccountBalance,
  Receipt,
  CreditCard,
  Download,
  Add,
  Refresh
} from '@mui/icons-material'
import { apiService } from '../../services/api'
import TransactionForm, { TransactionFormData } from '../forms/TransactionForm'

export default function FinancePage() {
  const [financeData, setFinanceData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  useEffect(() => {
    fetchFinanceData()
  }, [statusFilter])

  const fetchFinanceData = async () => {
    try {
      setLoading(true)
      const [financeOverview, transactionsData] = await Promise.all([
        apiService.getFinanceOverview(),
        apiService.getFinanceTransactions({ limit: 10, status: statusFilter })
      ])

      setFinanceData({
        ...financeOverview,
        transactions: transactionsData.transactions || []
      })
      setError(null)
    } catch (err: any) {
      console.error('Failed to fetch finance data:', err)
      setError(err.message || 'Failed to load finance data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTransaction = async (data: TransactionFormData) => {
    try {
      await apiService.createTransaction(data)
      setSnackbar({ open: true, message: 'Transaction berhasil ditambahkan!', severity: 'success' })
      fetchFinanceData()
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Gagal menambahkan transaction', severity: 'error' })
      throw error
    }
  }

  const handleUpdateTransaction = async (data: TransactionFormData) => {
    try {
      await apiService.updateTransaction(editingTransaction.id, data)
      setSnackbar({ open: true, message: 'Transaction berhasil diperbarui!', severity: 'success' })
      fetchFinanceData()
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Gagal memperbarui transaction', severity: 'error' })
      throw error
    }
  }

  const handleDeleteTransaction = async (transactionId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaction ini?')) {
      try {
        await apiService.deleteTransaction(transactionId)
        setSnackbar({ open: true, message: 'Transaction berhasil dihapus!', severity: 'success' })
        fetchFinanceData()
      } catch (error: any) {
        setSnackbar({ open: true, message: error.message || 'Gagal menghapus transaction', severity: 'error' })
      }
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: '#DC143C' }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Please try refreshing the page
        </Typography>
      </Box>
    )
  }

  const financeStats = [
    {
      title: 'Total Income',
      value: `Rp ${(financeData?.totalIncome || 0).toLocaleString()}`,
      change: '+15.2%',
      trend: 'up',
      icon: <AttachMoney />,
      color: '#4CAF50'
    },
    {
      title: 'Total Expenses',
      value: `Rp ${(financeData?.totalExpenses || 0).toLocaleString()}`,
      change: '+8.5%',
      trend: 'up',
      icon: <Receipt />,
      color: '#f44336'
    },
    {
      title: 'Net Revenue',
      value: `Rp ${(financeData?.totalRevenue || 0).toLocaleString()}`,
      change: financeData?.totalRevenue >= 0 ? '+6.7%' : '-2.3%',
      trend: financeData?.totalRevenue >= 0 ? 'up' : 'down',
      icon: <AccountBalance />,
      color: financeData?.totalRevenue >= 0 ? '#4CAF50' : '#f44336'
    },
    {
      title: 'Total Transactions',
      value: (financeData?.totalOrders || 0).toString(),
      change: `${financeData?.completedOrders || 0} completed`,
      trend: 'up',
      icon: <CreditCard />,
      color: '#1A1A1A'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50'
      case 'pending': return '#FF9800'
      case 'processing': return '#2196F3'
      case 'cancelled': return '#f44336'
      default: return '#757575'
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
            Finance & Accounting 💰
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Kelola keuangan, pembayaran, dan laporan finansial
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => window.open('http://localhost:3001/api/finance/export', '_blank')}
            sx={{
              borderColor: '#DC143C',
              color: '#DC143C',
              '&:hover': {
                borderColor: '#B91C3C',
                backgroundColor: 'rgba(220, 20, 60, 0.04)'
              }
            }}
          >
            Export Report
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditingTransaction(null)
              setFormOpen(true)
            }}
            sx={{
              background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(220, 20, 60, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            New Transaction
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {financeStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                border: `1px solid ${stat.color}20`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${stat.color}20`
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      {stat.trend === 'up' ? (
                        <TrendingUp sx={{ color: '#4CAF50', fontSize: 16, mr: 0.5 }} />
                      ) : (
                        <TrendingDown sx={{ color: '#f44336', fontSize: 16, mr: 0.5 }} />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color: stat.trend === 'up' ? '#4CAF50' : '#f44336',
                          fontWeight: 'medium'
                        }}
                      >
                        {stat.change}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: `${stat.color}15`,
                      color: stat.color,
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Analytics Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Revenue Progress
            </Typography>
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Monthly Target</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  Rp {(financeData?.completedRevenue || 0).toLocaleString()} / Rp 500,000,000
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min((financeData?.completedRevenue || 0) / 500000000 * 100, 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#DC143C'
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Top Customers
            </Typography>
            <Box>
              {(financeData?.topCustomers || []).slice(0, 5).map((customer: any, index: number) => (
                <Box key={index} mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">{customer.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      Rp {customer.revenue?.toLocaleString()}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((customer.revenue / (financeData?.totalRevenue || 1)) * 100, 100)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: index === 0 ? '#DC143C' : index === 1 ? '#4CAF50' : '#FF9800'
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Payment Methods
            </Typography>
            <Box>
              {(financeData?.paymentMethods || []).map((method: any, index: number) => (
                <Box key={index} mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">{method.method}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {method.count} ({method.percentage}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={method.percentage}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: index === 0 ? '#DC143C' : index === 1 ? '#4CAF50' : '#FF9800'
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Quick Actions
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: '#DC143C',
                  color: '#DC143C',
                  '&:hover': {
                    borderColor: '#B91C3C',
                    backgroundColor: 'rgba(220, 20, 60, 0.04)'
                  }
                }}
              >
                Generate Invoice
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: '#DC143C',
                  color: '#DC143C',
                  '&:hover': {
                    borderColor: '#B91C3C',
                    backgroundColor: 'rgba(220, 20, 60, 0.04)'
                  }
                }}
              >
                Record Payment
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: '#DC143C',
                  color: '#DC143C',
                  '&:hover': {
                    borderColor: '#B91C3C',
                    backgroundColor: 'rgba(220, 20, 60, 0.04)'
                  }
                }}
              >
                View Reports
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Paper sx={{ borderRadius: 2 }}>
        <Box p={3} borderBottom="1px solid #e0e0e0">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Recent Transactions
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
                sx={{
                  borderColor: '#DC143C',
                  color: '#DC143C',
                  '&:hover': {
                    borderColor: '#B91C3C',
                    backgroundColor: 'rgba(220, 20, 60, 0.04)'
                  }
                }}
              >
                Refresh
              </Button>
            </Box>
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Transaction</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(financeData?.transactions || []).map((transaction: any) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {transaction.reference}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {transaction.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {transaction.customer?.company || transaction.customer?.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>
                    <Typography variant="body2" sx={{
                      color: transaction.type === 'income' ? '#4CAF50' : '#f44336',
                      fontWeight: 'bold'
                    }}>
                      {transaction.type === 'income' ? '+' : '-'}Rp {transaction.amount?.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.status}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(transaction.status)}15`,
                        color: getStatusColor(transaction.status),
                        fontWeight: 'medium',
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setEditingTransaction(transaction)
                          setFormOpen(true)
                        }}
                        sx={{
                          borderColor: '#DC143C',
                          color: '#DC143C',
                          '&:hover': {
                            borderColor: '#B91C3C',
                            backgroundColor: 'rgba(220, 20, 60, 0.04)'
                          }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Transaction Form Dialog */}
      <TransactionForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingTransaction(null)
        }}
        onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
        initialData={editingTransaction}
        title={editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

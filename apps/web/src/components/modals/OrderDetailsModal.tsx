import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  Paper,
  IconButton
} from '@mui/material'
import {
  Close,
  Print,
  Email,
  Download,
  Person,
  Business,
  Phone,
  AttachMoney,
  CalendarToday,
  Numbers
} from '@mui/icons-material'

interface OrderDetailsModalProps {
  open: boolean
  onClose: () => void
  order: any
  onPrint?: () => void
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  open,
  onClose,
  order,
  onPrint
}) => {
  if (!order) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50'
      case 'pending': return '#FF9800'
      case 'processing': return '#2196F3'
      case 'cancelled': return '#f44336'
      default: return '#757575'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'pending': return 'Pending'
      case 'processing': return 'Processing'
      case 'cancelled': return 'Cancelled'
      default: return 'Unknown'
    }
  }

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order ${order.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-info { margin-bottom: 20px; }
          .order-info { margin-bottom: 20px; }
          .customer-info { margin-bottom: 20px; }
          .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .details-table th, .details-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .details-table th { background-color: #f2f2f2; }
          .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
          .status { padding: 5px 10px; border-radius: 4px; color: white; }
          .status.completed { background-color: #4CAF50; }
          .status.pending { background-color: #FF9800; }
          .status.processing { background-color: #2196F3; }
          .status.cancelled { background-color: #f44336; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ERP Platform</h1>
          <h2>Order Invoice</h2>
        </div>
        
        <div class="company-info">
          <strong>ERP Platform</strong><br>
          Jl. Sudirman No. 123, Jakarta<br>
          Phone: +62 21-1234-5678<br>
          Email: info@erp-platform.com
        </div>
        
        <div class="order-info">
          <h3>Order Information</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span class="status ${order.status}">${getStatusLabel(order.status)}</span></p>
        </div>
        
        <div class="customer-info">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${order.customer?.name || 'N/A'}</p>
          <p><strong>Company:</strong> ${order.customer?.company || 'N/A'}</p>
          <p><strong>Email:</strong> ${order.customer?.email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${order.customer?.phone || 'N/A'}</p>
        </div>
        
        <div class="total">
          <p>Total Amount: Rp ${order.totalAmount?.toLocaleString() || '0'}</p>
        </div>
        
        <div style="margin-top: 40px; text-align: center; color: #666;">
          <p>Thank you for your business!</p>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }

    if (onPrint) onPrint()
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 2, 
        borderBottom: '1px solid #e0e0e0',
        background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">Order Details - {order.orderNumber}</Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          {/* Order Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#DC143C', fontWeight: 'bold' }}>
                Order Information
              </Typography>
              
              <Box display="flex" alignItems="center" mb={2}>
                <Numbers sx={{ mr: 1, color: '#666' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Order Number</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {order.orderNumber}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <CalendarToday sx={{ mr: 1, color: '#666' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Order Date</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <AttachMoney sx={{ mr: 1, color: '#666' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#DC143C' }}>
                    Rp {order.totalAmount?.toLocaleString() || '0'}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    label={getStatusLabel(order.status)}
                    sx={{
                      backgroundColor: `${getStatusColor(order.status)}15`,
                      color: getStatusColor(order.status),
                      fontWeight: 'medium',
                      mt: 0.5
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#DC143C', fontWeight: 'bold' }}>
                Customer Information
              </Typography>
              
              <Box display="flex" alignItems="center" mb={2}>
                <Person sx={{ mr: 1, color: '#666' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Customer Name</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {order.customer?.name || 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <Business sx={{ mr: 1, color: '#666' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Company</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {order.customer?.company || 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <Email sx={{ mr: 1, color: '#666' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {order.customer?.email || 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center">
                <Phone sx={{ mr: 1, color: '#666' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {order.customer?.phone || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
        <Button
          variant="outlined"
          startIcon={<Print />}
          onClick={handlePrint}
          sx={{
            borderColor: '#DC143C',
            color: '#DC143C',
            '&:hover': {
              borderColor: '#B91C3C',
              backgroundColor: 'rgba(220, 20, 60, 0.04)'
            }
          }}
        >
          Print Invoice
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            background: 'linear-gradient(135deg, #DC143C 0%, #1A1A1A 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #B91C3C 0%, #000000 100%)',
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OrderDetailsModal

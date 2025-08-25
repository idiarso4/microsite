const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('./generated/prisma')
const { createServer } = require('http')
const { WebSocketServer } = require('ws')

// Initialize Prisma Client
const prisma = new PrismaClient()

// Create Express app and HTTP server
const app = express()
const server = createServer(app)
const PORT = process.env.PORT || 3001

// WebSocket Server
const wss = new WebSocketServer({
  server,
  path: '/ws'
})

// Store connected clients
const clients = new Map()

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const clientId = Math.random().toString(36).substring(7)
  clients.set(clientId, ws)

  console.log(`WebSocket client connected: ${clientId}`)

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection',
    data: { message: 'Connected to ERP WebSocket server', clientId },
    timestamp: new Date().toISOString()
  }))

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString())
      console.log(`Received from ${clientId}:`, message)

      // Handle different message types
      switch (message.type) {
        case 'heartbeat':
          ws.send(JSON.stringify({
            type: 'heartbeat_ack',
            timestamp: new Date().toISOString()
          }))
          break

        case 'user_activity':
          // Broadcast user activity to other clients
          broadcastToOthers(clientId, {
            type: 'user_activity',
            data: message,
            timestamp: new Date().toISOString()
          })
          break

        default:
          console.log('Unknown message type:', message.type)
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error)
    }
  })

  // Handle client disconnect
  ws.on('close', () => {
    console.log(`WebSocket client disconnected: ${clientId}`)
    clients.delete(clientId)
  })

  ws.on('error', (error) => {
    console.error(`WebSocket error for client ${clientId}:`, error)
    clients.delete(clientId)
  })
})

// Broadcast message to all clients except sender
function broadcastToOthers(senderId, message) {
  clients.forEach((client, clientId) => {
    if (clientId !== senderId && client.readyState === client.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}

// Broadcast message to all clients
function broadcastToAll(message) {
  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}

// Function to send real-time notifications
function sendNotification(type, data, module = 'system') {
  const notification = {
    type: 'notification',
    data: {
      id: Math.random().toString(36).substring(7),
      type,
      title: data.title,
      message: data.message,
      description: data.description,
      module,
      timestamp: new Date().toISOString(),
      read: false
    },
    timestamp: new Date().toISOString()
  }

  broadcastToAll(notification)
  console.log('Sent notification:', notification)
}

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: 'development'
  })
})

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body
    console.log('Login attempt:', { email, password })

    // For demo purposes, check demo credentials
    if (email === 'admin@erp.com' && password === 'admin123') {
      const user = {
        id: 1,
        email: 'admin@erp.com',
        name: 'Admin User',
        role: 'admin',
        company: 'Tech-Development Demo Company'
      }

      // In real app, generate proper JWT token
      const token = 'demo-jwt-token-' + Date.now()
      const refreshToken = 'demo-refresh-token-' + Date.now()
      const expiresIn = 24 * 60 * 60 // 24 hours in seconds

      console.log('Login successful for:', email)
      res.json({
        message: 'Login successful',
        user,
        token,
        refreshToken,
        expiresIn
      })
    } else {
      console.log('Invalid credentials for:', email)
      res.status(401).json({ error: 'Invalid credentials' })
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

app.get('/api/auth/me', (req, res) => {
  try {
    // In real app, verify JWT token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // For demo, return demo user
    const user = {
      id: 1,
      email: 'admin@erp.com',
      name: 'Admin User',
      role: 'admin',
      company: 'Tech-Development Demo Company'
    }

    res.json({ user })
  } catch (error) {
    console.error('Profile error:', error)
    res.status(500).json({ error: 'Failed to get profile' })
  }
})

// Dashboard API with mock data (fallback when database is not available)
app.get('/api/dashboard/overview', async (req, res) => {
  try {
    // Try to get real data from database, fallback to mock data
    let stats, recentOrders, recentActivities

    try {
      const totalUsers = await prisma.user.count()
      const totalProducts = await prisma.product.count()
      const totalOrders = await prisma.order.count()
      const totalLeads = await prisma.lead.count()

      const orders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { name: true, company: true } }
        }
      })

      const totalRevenue = await prisma.order.aggregate({
        _sum: { totalAmount: true }
      })

      stats = {
        revenue: {
          current: totalRevenue._sum.totalAmount || 0,
          change: 12.5,
          trend: 'up'
        },
        orders: {
          current: totalOrders,
          change: -2.1,
          trend: 'down'
        },
        customers: {
          current: totalUsers,
          change: 8.2,
          trend: 'up'
        },
        inventory: {
          current: totalProducts,
          change: 5.4,
          trend: 'up'
        }
      }

      recentOrders = orders.map(order => ({
        id: order.orderNumber,
        customer: order.customer.company || order.customer.name,
        amount: order.totalAmount,
        status: order.status,
        date: order.orderDate.toISOString().split('T')[0]
      }))

      recentActivities = [
        { id: 1, type: 'order', message: `New order received (${totalOrders} total)`, time: '5 min ago' },
        { id: 2, type: 'payment', message: `Payment received (Rp ${(totalRevenue._sum.totalAmount || 0).toLocaleString()})`, time: '15 min ago' },
        { id: 3, type: 'inventory', message: `${totalProducts} products in inventory`, time: '1 hour ago' },
        { id: 4, type: 'user', message: `${totalUsers} active users`, time: '2 hours ago' },
        { id: 5, type: 'lead', message: `${totalLeads} leads in pipeline`, time: '3 hours ago' }
      ]

      console.log('Dashboard data requested - real data from database')
    } catch (dbError) {
      console.log('Database not available, using mock data:', dbError.message)

      // Fallback to mock data
      stats = {
        revenue: {
          current: 15750000,
          change: 12.5,
          trend: 'up'
        },
        orders: {
          current: 156,
          change: 8.3,
          trend: 'up'
        },
        customers: {
          current: 89,
          change: -2.1,
          trend: 'down'
        },
        inventory: {
          current: 1247,
          change: 5.7,
          trend: 'up'
        }
      }

      recentOrders = [
        { id: 'ORD-001', customer: 'PT. ABC Corp', amount: 2500000, status: 'completed', date: '2025-01-25' },
        { id: 'ORD-002', customer: 'CV. XYZ Ltd', amount: 1750000, status: 'pending', date: '2025-01-24' },
        { id: 'ORD-003', customer: 'PT. DEF Inc', amount: 3200000, status: 'processing', date: '2025-01-24' },
        { id: 'ORD-004', customer: 'UD. GHI', amount: 890000, status: 'completed', date: '2025-01-23' },
        { id: 'ORD-005', customer: 'PT. JKL Group', amount: 4100000, status: 'shipped', date: '2025-01-23' }
      ]

      recentActivities = [
        { id: 1, type: 'order', message: 'New order #ORD-001 received', time: '5 min ago' },
        { id: 2, type: 'payment', message: 'Payment of Rp 2.5M received', time: '15 min ago' },
        { id: 3, type: 'inventory', message: 'Low stock alert for Product A', time: '1 hour ago' },
        { id: 4, type: 'user', message: 'New user registered', time: '2 hours ago' },
        { id: 5, type: 'lead', message: 'New lead from website contact form', time: '3 hours ago' }
      ]
    }

    res.json({
      stats,
      recentOrders,
      recentActivities
    })

  } catch (error) {
    console.error('Dashboard error:', error)
    res.status(500).json({ error: 'Failed to get dashboard data' })
  }
})

// Leads CRUD Operations
app.get('/api/leads', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query
    const skip = (page - 1) * limit

    let where = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { company: { contains: search } },
        { contactName: { contains: search } },
        { email: { contains: search } }
      ]
    }

    const leads = await prisma.lead.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: { select: { name: true } }
      }
    })

    const total = await prisma.lead.count({ where })

    res.json({
      leads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })

    console.log('Leads data requested - real data')
  } catch (error) {
    console.error('Leads error:', error)
    res.status(500).json({ error: 'Failed to get leads' })
  }
})

// Create new lead
app.post('/api/leads', async (req, res) => {
  try {
    const { company, contactName, email, phone, value, status, stage, notes } = req.body

    const lead = await prisma.lead.create({
      data: {
        company,
        contactName,
        email,
        phone,
        value: parseFloat(value),
        status,
        stage,
        notes,
        lastContact: new Date()
      }
    })

    res.status(201).json({ lead, message: 'Lead created successfully' })
    console.log('Lead created:', lead.id)
  } catch (error) {
    console.error('Create lead error:', error)
    res.status(500).json({ error: 'Failed to create lead' })
  }
})

// Update lead
app.put('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { company, contactName, email, phone, value, status, stage, notes } = req.body

    const lead = await prisma.lead.update({
      where: { id: parseInt(id) },
      data: {
        company,
        contactName,
        email,
        phone,
        value: parseFloat(value),
        status,
        stage,
        notes,
        lastContact: new Date()
      }
    })

    res.json({ lead, message: 'Lead updated successfully' })
    console.log('Lead updated:', lead.id)
  } catch (error) {
    console.error('Update lead error:', error)
    res.status(500).json({ error: 'Failed to update lead' })
  }
})

// Delete lead
app.delete('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.lead.delete({
      where: { id: parseInt(id) }
    })

    res.json({ message: 'Lead deleted successfully' })
    console.log('Lead deleted:', id)
  } catch (error) {
    console.error('Delete lead error:', error)
    res.status(500).json({ error: 'Failed to delete lead' })
  }
})

// Products CRUD Operations
app.get('/api/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, categoryId, search } = req.query
    const skip = (page - 1) * limit

    let where = {}
    if (categoryId) where.categoryId = parseInt(categoryId)
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } }
      ]
    }

    const products = await prisma.product.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } }
      }
    })

    const total = await prisma.product.count({ where })

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })

    console.log('Products data requested - real data')
  } catch (error) {
    console.error('Products error:', error)
    res.status(500).json({ error: 'Failed to get products' })
  }
})

// Create new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, sku, description, price, cost, stock, minStock, categoryId } = req.body

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description,
        price: parseFloat(price),
        cost: cost ? parseFloat(cost) : parseFloat(price) * 0.7, // Default cost 70% of price
        stock: parseInt(stock),
        minStock: parseInt(minStock),
        categoryId: parseInt(categoryId),
        status: 'active'
      },
      include: {
        category: { select: { name: true } }
      }
    })

    res.status(201).json({ product, message: 'Product created successfully' })
    console.log('Product created:', product.id)
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, sku, description, price, cost, stock, minStock, categoryId } = req.body

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        sku,
        description,
        price: parseFloat(price),
        cost: cost ? parseFloat(cost) : undefined,
        stock: parseInt(stock),
        minStock: parseInt(minStock),
        categoryId: parseInt(categoryId)
      },
      include: {
        category: { select: { name: true } }
      }
    })

    res.json({ product, message: 'Product updated successfully' })
    console.log('Product updated:', product.id)
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({ error: 'Failed to update product' })
  }
})

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.product.delete({
      where: { id: parseInt(id) }
    })

    res.json({ message: 'Product deleted successfully' })
    console.log('Product deleted:', id)
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

// Orders CRUD Operations
app.get('/api/orders', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query
    const skip = (page - 1) * limit

    let where = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } }
      ]
    }

    const orders = await prisma.order.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true, company: true, email: true } }
      }
    })

    const total = await prisma.order.count({ where })

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })

    console.log('Orders data requested - real data')
  } catch (error) {
    console.error('Orders error:', error)
    res.status(500).json({ error: 'Failed to get orders' })
  }
})

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const { orderNumber, customerId, totalAmount, status = 'pending', orderDate } = req.body

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: parseInt(customerId),
        totalAmount: parseFloat(totalAmount),
        status,
        orderDate: orderDate ? new Date(orderDate) : new Date(),
        createdById: 1 // Default user ID
      },
      include: {
        customer: { select: { name: true, company: true, email: true } }
      }
    })

    res.status(201).json({ order, message: 'Order created successfully' })
    console.log('Order created:', order.id)
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// Update order
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { orderNumber, customerId, totalAmount, status, orderDate } = req.body

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        orderNumber,
        customerId: parseInt(customerId),
        totalAmount: parseFloat(totalAmount),
        status,
        orderDate: orderDate ? new Date(orderDate) : undefined
      },
      include: {
        customer: { select: { name: true, company: true, email: true } }
      }
    })

    res.json({ order, message: 'Order updated successfully' })
    console.log('Order updated:', order.id)
  } catch (error) {
    console.error('Update order error:', error)
    res.status(500).json({ error: 'Failed to update order' })
  }
})

// Delete order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.order.delete({
      where: { id: parseInt(id) }
    })

    res.json({ message: 'Order deleted successfully' })
    console.log('Order deleted:', id)
  } catch (error) {
    console.error('Delete order error:', error)
    res.status(500).json({ error: 'Failed to delete order' })
  }
})

// Export orders (must be before /:id route)
app.get('/api/orders/export', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true, company: true, email: true } }
      }
    })

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=orders.csv')

    // Create CSV content
    let csv = 'Order Number,Customer,Company,Email,Total Amount,Status,Order Date\n'
    orders.forEach(order => {
      csv += `"${order.orderNumber}","${order.customer?.name || ''}","${order.customer?.company || ''}","${order.customer?.email || ''}",${order.totalAmount},"${order.status}","${order.orderDate}"\n`
    })

    res.send(csv)
    console.log('Orders exported to CSV')
  } catch (error) {
    console.error('Export orders error:', error)
    res.status(500).json({ error: 'Failed to export orders' })
  }
})

// Get single order
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: true,
        createdBy: { select: { name: true, email: true } }
      }
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json({ order })
    console.log('Order details requested:', order.id)
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({ error: 'Failed to get order' })
  }
})

// Update order status
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        customer: { select: { name: true, company: true, email: true } }
      }
    })

    res.json({ order, message: 'Order status updated successfully' })
    console.log('Order status updated:', order.id)
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({ error: 'Failed to update order status' })
  }
})

// Finance API
app.get('/api/finance/overview', async (req, res) => {
  try {
    // Get financial data from orders
    const orders = await prisma.order.findMany({
      include: {
        customer: { select: { name: true, company: true } }
      }
    })

    // Calculate financial metrics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    const totalIncome = orders
      .filter(order => order.totalAmount > 0)
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    const totalExpenses = Math.abs(orders
      .filter(order => order.totalAmount < 0)
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0))
    const completedRevenue = orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    const pendingRevenue = orders
      .filter(order => order.status === 'pending')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0)

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const recentOrders = orders.filter(order =>
      new Date(order.orderDate) >= sixMonthsAgo
    )

    const monthlyRevenue = {}
    recentOrders.forEach(order => {
      const month = new Date(order.orderDate).toISOString().slice(0, 7) // YYYY-MM
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.totalAmount
    })

    // Top customers by revenue
    const customerRevenue = {}
    orders.forEach(order => {
      const customerKey = order.customer?.company || order.customer?.name || 'Unknown'
      customerRevenue[customerKey] = (customerRevenue[customerKey] || 0) + order.totalAmount
    })

    const topCustomers = Object.entries(customerRevenue)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Payment methods (mock data for now)
    const paymentMethods = [
      { method: 'Bank Transfer', count: Math.floor(orders.length * 0.6), percentage: 60 },
      { method: 'Credit Card', count: Math.floor(orders.length * 0.25), percentage: 25 },
      { method: 'Cash', count: Math.floor(orders.length * 0.15), percentage: 15 }
    ]

    res.json({
      totalRevenue,
      totalIncome,
      totalExpenses,
      completedRevenue,
      pendingRevenue,
      monthlyRevenue,
      topCustomers,
      paymentMethods,
      totalOrders: orders.length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      pendingOrders: orders.filter(o => o.status === 'pending').length
    })

    console.log('Finance overview data requested')
  } catch (error) {
    console.error('Finance overview error:', error)
    res.status(500).json({ error: 'Failed to get finance overview' })
  }
})

// Finance transactions
app.get('/api/finance/transactions', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const skip = (page - 1) * limit

    let where = {}
    if (status) where.status = status

    const orders = await prisma.order.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true, company: true, email: true } }
      }
    })

    // Transform orders to transaction format
    const transactions = orders.map(order => ({
      id: order.id,
      type: 'income',
      description: `Order ${order.orderNumber}`,
      amount: order.totalAmount,
      status: order.status,
      date: order.orderDate,
      customer: order.customer,
      reference: order.orderNumber
    }))

    const total = await prisma.order.count({ where })

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })

    console.log('Finance transactions data requested')
  } catch (error) {
    console.error('Finance transactions error:', error)
    res.status(500).json({ error: 'Failed to get finance transactions' })
  }
})

// Create manual transaction (expense/income)
app.post('/api/finance/transactions', async (req, res) => {
  try {
    const { type, description, amount, customerId, category, reference } = req.body

    // For manual transactions, we'll create a special order with negative amount for expenses
    const orderData = {
      orderNumber: reference || `TXN-${Date.now()}`,
      customerId: customerId ? parseInt(customerId) : 1, // Default customer
      totalAmount: type === 'expense' ? -Math.abs(parseFloat(amount)) : parseFloat(amount),
      status: 'completed', // Manual transactions are immediately completed
      orderDate: new Date(),
      createdById: 1 // Default user ID
    }

    const transaction = await prisma.order.create({
      data: orderData,
      include: {
        customer: { select: { name: true, company: true, email: true } }
      }
    })

    res.status(201).json({
      transaction: {
        id: transaction.id,
        type,
        description: description || `Manual ${type}`,
        amount: Math.abs(transaction.totalAmount),
        status: transaction.status,
        date: transaction.orderDate,
        customer: transaction.customer,
        reference: transaction.orderNumber
      },
      message: 'Transaction created successfully'
    })
    console.log('Manual transaction created:', transaction.id)
  } catch (error) {
    console.error('Create transaction error:', error)
    res.status(500).json({ error: 'Failed to create transaction' })
  }
})

// Update transaction
app.put('/api/finance/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { type, description, amount, customerId, status } = req.body

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        totalAmount: type === 'expense' ? -Math.abs(parseFloat(amount)) : parseFloat(amount),
        customerId: customerId ? parseInt(customerId) : undefined,
        status: status || 'completed'
      },
      include: {
        customer: { select: { name: true, company: true, email: true } }
      }
    })

    res.json({
      transaction: {
        id: updatedOrder.id,
        type,
        description: description || `Manual ${type}`,
        amount: Math.abs(updatedOrder.totalAmount),
        status: updatedOrder.status,
        date: updatedOrder.orderDate,
        customer: updatedOrder.customer,
        reference: updatedOrder.orderNumber
      },
      message: 'Transaction updated successfully'
    })
    console.log('Transaction updated:', updatedOrder.id)
  } catch (error) {
    console.error('Update transaction error:', error)
    res.status(500).json({ error: 'Failed to update transaction' })
  }
})

// Delete transaction
app.delete('/api/finance/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.order.delete({
      where: { id: parseInt(id) }
    })

    res.json({ message: 'Transaction deleted successfully' })
    console.log('Transaction deleted:', id)
  } catch (error) {
    console.error('Delete transaction error:', error)
    res.status(500).json({ error: 'Failed to delete transaction' })
  }
})

// Finance export
app.get('/api/finance/export', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true, company: true, email: true } }
      }
    })

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=finance-report.csv')

    // Create CSV content
    let csv = 'Date,Type,Description,Customer,Company,Amount,Status,Reference\n'
    orders.forEach(order => {
      const type = order.totalAmount >= 0 ? 'Income' : 'Expense'
      const amount = Math.abs(order.totalAmount)
      csv += `"${order.orderDate}","${type}","Order ${order.orderNumber}","${order.customer?.name || ''}","${order.customer?.company || ''}",${amount},"${order.status}","${order.orderNumber}"\n`
    })

    res.send(csv)
    console.log('Finance data exported to CSV')
  } catch (error) {
    console.error('Export finance error:', error)
    res.status(500).json({ error: 'Failed to export finance data' })
  }
})

// Customers API
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { name: 'asc' }
    })

    res.json({ customers })
    console.log('Customers data requested')
  } catch (error) {
    console.error('Customers error:', error)
    res.status(500).json({ error: 'Failed to get customers' })
  }
})

// Categories API
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })

    res.json({ categories })
    console.log('Categories data requested')
  } catch (error) {
    console.error('Categories error:', error)
    res.status(500).json({ error: 'Failed to get categories' })
  }
})

// Purchases API
app.get('/api/purchases', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query
    const skip = (page - 1) * limit

    let where = {}
    if (search) {
      where.OR = [
        { purchaseNumber: { contains: search } },
        { supplierName: { contains: search } },
        { supplierEmail: { contains: search } }
      ]
    }
    if (status) where.status = status

    const purchases = await prisma.purchase.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: { select: { name: true, email: true } },
        purchaseItems: {
          include: {
            product: { select: { name: true, sku: true } }
          }
        }
      }
    })

    const total = await prisma.purchase.count({ where })

    res.json({
      purchases,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })

    console.log('Purchases data requested')
  } catch (error) {
    console.error('Purchases error:', error)
    res.status(500).json({ error: 'Failed to get purchases' })
  }
})

// Create purchase
app.post('/api/purchases', async (req, res) => {
  try {
    const {
      supplierName,
      supplierEmail,
      supplierPhone,
      supplierAddress,
      expectedDate,
      notes,
      items
    } = req.body

    const purchaseNumber = `PO-${Date.now()}`
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)

    const purchase = await prisma.purchase.create({
      data: {
        purchaseNumber,
        supplierName,
        supplierEmail,
        supplierPhone,
        supplierAddress,
        totalAmount,
        expectedDate: expectedDate ? new Date(expectedDate) : null,
        notes,
        createdById: 1, // Default user ID
        purchaseItems: {
          create: items.map(item => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
            totalPrice: parseInt(item.quantity) * parseFloat(item.unitPrice)
          }))
        }
      },
      include: {
        createdBy: { select: { name: true, email: true } },
        purchaseItems: {
          include: {
            product: { select: { name: true, sku: true } }
          }
        }
      }
    })

    res.status(201).json({ purchase, message: 'Purchase created successfully' })
    console.log('Purchase created:', purchase.id)
  } catch (error) {
    console.error('Create purchase error:', error)
    res.status(500).json({ error: 'Failed to create purchase' })
  }
})

// Export purchases (must be before /:id route)
app.get('/api/purchases/export', async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: { select: { name: true } },
        purchaseItems: {
          include: {
            product: { select: { name: true, sku: true } }
          }
        }
      }
    })

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=purchases.csv')

    // Create CSV content
    let csv = 'Purchase Number,Supplier,Email,Phone,Total Amount,Status,Purchase Date,Expected Date,Items\n'
    purchases.forEach(purchase => {
      const items = purchase.purchaseItems.map(item => `${item.product.name} (${item.quantity})`).join('; ')
      csv += `"${purchase.purchaseNumber}","${purchase.supplierName}","${purchase.supplierEmail || ''}","${purchase.supplierPhone || ''}",${purchase.totalAmount},"${purchase.status}","${purchase.purchaseDate}","${purchase.expectedDate || ''}","${items}"\n`
    })

    res.send(csv)
    console.log('Purchases exported to CSV')
  } catch (error) {
    console.error('Export purchases error:', error)
    res.status(500).json({ error: 'Failed to export purchases' })
  }
})

// Get single purchase
app.get('/api/purchases/:id', async (req, res) => {
  try {
    const { id } = req.params

    const purchase = await prisma.purchase.findUnique({
      where: { id: parseInt(id) },
      include: {
        createdBy: { select: { name: true, email: true } },
        purchaseItems: {
          include: {
            product: { select: { name: true, sku: true, price: true } }
          }
        }
      }
    })

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' })
    }

    res.json({ purchase })
    console.log('Purchase details requested:', purchase.id)
  } catch (error) {
    console.error('Get purchase error:', error)
    res.status(500).json({ error: 'Failed to get purchase' })
  }
})

// Update purchase
app.put('/api/purchases/:id', async (req, res) => {
  try {
    const { id } = req.params
    const {
      supplierName,
      supplierEmail,
      supplierPhone,
      supplierAddress,
      expectedDate,
      notes,
      status
    } = req.body

    const purchase = await prisma.purchase.update({
      where: { id: parseInt(id) },
      data: {
        supplierName,
        supplierEmail,
        supplierPhone,
        supplierAddress,
        expectedDate: expectedDate ? new Date(expectedDate) : null,
        notes,
        status,
        receivedDate: status === 'received' ? new Date() : null
      },
      include: {
        createdBy: { select: { name: true, email: true } },
        purchaseItems: {
          include: {
            product: { select: { name: true, sku: true } }
          }
        }
      }
    })

    res.json({ purchase, message: 'Purchase updated successfully' })
    console.log('Purchase updated:', purchase.id)
  } catch (error) {
    console.error('Update purchase error:', error)
    res.status(500).json({ error: 'Failed to update purchase' })
  }
})

// Delete purchase
app.delete('/api/purchases/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.purchase.delete({
      where: { id: parseInt(id) }
    })

    res.json({ message: 'Purchase deleted successfully' })
    console.log('Purchase deleted:', id)
  } catch (error) {
    console.error('Delete purchase error:', error)
    res.status(500).json({ error: 'Failed to delete purchase' })
  }
})

// Employees API
app.get('/api/employees', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department, status } = req.query
    const skip = (page - 1) * limit

    let where = {}
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { employeeId: { contains: search } },
        { position: { contains: search } }
      ]
    }
    if (department) where.department = department
    if (status) where.status = status

    const employees = await prisma.employee.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: { select: { name: true, email: true } }
      }
    })

    const total = await prisma.employee.count({ where })

    res.json({
      employees,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })

    console.log('Employees data requested')
  } catch (error) {
    console.error('Employees error:', error)
    res.status(500).json({ error: 'Failed to get employees' })
  }
})

// Create employee
app.post('/api/employees', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      position,
      department,
      salary,
      hireDate,
      birthDate,
      emergencyContact,
      emergencyPhone
    } = req.body

    const employeeId = `EMP-${Date.now()}`

    const employee = await prisma.employee.create({
      data: {
        employeeId,
        name,
        email,
        phone,
        address,
        position,
        department,
        salary: parseFloat(salary),
        hireDate: new Date(hireDate),
        birthDate: birthDate ? new Date(birthDate) : null,
        emergencyContact,
        emergencyPhone,
        createdById: 1 // Default user ID
      },
      include: {
        createdBy: { select: { name: true, email: true } }
      }
    })

    res.status(201).json({ employee, message: 'Employee created successfully' })
    console.log('Employee created:', employee.id)
  } catch (error) {
    console.error('Create employee error:', error)
    res.status(500).json({ error: 'Failed to create employee' })
  }
})

// Export employees (must be before /:id route)
app.get('/api/employees/export', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: { select: { name: true } }
      }
    })

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=employees.csv')

    // Create CSV content
    let csv = 'Employee ID,Name,Email,Phone,Position,Department,Salary,Hire Date,Status\n'
    employees.forEach(employee => {
      csv += `"${employee.employeeId}","${employee.name}","${employee.email}","${employee.phone || ''}","${employee.position}","${employee.department}",${employee.salary},"${employee.hireDate}","${employee.status}"\n`
    })

    res.send(csv)
    console.log('Employees exported to CSV')
  } catch (error) {
    console.error('Export employees error:', error)
    res.status(500).json({ error: 'Failed to export employees' })
  }
})

// Get single employee
app.get('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params

    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
      include: {
        createdBy: { select: { name: true, email: true } },
        attendances: {
          orderBy: { date: 'desc' },
          take: 10
        },
        payrolls: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    res.json({ employee })
    console.log('Employee details requested:', employee.id)
  } catch (error) {
    console.error('Get employee error:', error)
    res.status(500).json({ error: 'Failed to get employee' })
  }
})

// Update employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params
    const {
      name,
      email,
      phone,
      address,
      position,
      department,
      salary,
      status,
      emergencyContact,
      emergencyPhone
    } = req.body

    const employee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        address,
        position,
        department,
        salary: salary ? parseFloat(salary) : undefined,
        status,
        emergencyContact,
        emergencyPhone
      },
      include: {
        createdBy: { select: { name: true, email: true } }
      }
    })

    res.json({ employee, message: 'Employee updated successfully' })
    console.log('Employee updated:', employee.id)
  } catch (error) {
    console.error('Update employee error:', error)
    res.status(500).json({ error: 'Failed to update employee' })
  }
})

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.employee.delete({
      where: { id: parseInt(id) }
    })

    res.json({ message: 'Employee deleted successfully' })
    console.log('Employee deleted:', id)
  } catch (error) {
    console.error('Delete employee error:', error)
    res.status(500).json({ error: 'Failed to delete employee' })
  }
})

// Print/Export APIs
app.get('/api/leads/export', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: { select: { name: true } }
      }
    })

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv')

    // Create CSV content
    let csv = 'ID,Company,Contact Name,Email,Phone,Status,Stage,Value,Last Contact\n'
    leads.forEach(lead => {
      csv += `${lead.id},"${lead.company}","${lead.contactName}","${lead.email}","${lead.phone}","${lead.status}","${lead.stage}",${lead.value},"${lead.lastContact}"\n`
    })

    res.send(csv)
    console.log('Leads exported to CSV')
  } catch (error) {
    console.error('Export leads error:', error)
    res.status(500).json({ error: 'Failed to export leads' })
  }
})

app.get('/api/products/export', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } }
      }
    })

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv')

    // Create CSV content
    let csv = 'ID,Name,SKU,Category,Price,Stock,Min Stock,Description\n'
    products.forEach(product => {
      csv += `${product.id},"${product.name}","${product.sku}","${product.category.name}",${product.price},${product.stock},${product.minStock},"${product.description || ''}"\n`
    })

    res.send(csv)
    console.log('Products exported to CSV')
  } catch (error) {
    console.error('Export products error:', error)
    res.status(500).json({ error: 'Failed to export products' })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details
    })
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token'
    })
  }

  return res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  })
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

// Start server with WebSocket support
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`🔌 WebSocket server running on ws://localhost:${PORT}/ws`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 CORS enabled for: http://localhost:5173`)

  // Send periodic dashboard updates (demo)
  setInterval(() => {
    const updates = {
      type: 'dashboard_update',
      data: {
        stats: {
          revenue: {
            current: Math.floor(Math.random() * 20000000) + 10000000,
            change: (Math.random() * 20 - 10).toFixed(1),
            trend: Math.random() > 0.5 ? 'up' : 'down'
          }
        },
        lastUpdate: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    }

    if (clients.size > 0) {
      broadcastToAll(updates)
      console.log(`📊 Sent dashboard update to ${clients.size} clients`)
    }
  }, 30000) // Every 30 seconds

  // Send sample notifications periodically
  const sampleNotifications = [
    { title: 'New Order Received', message: 'Order #ORD-' + Math.floor(Math.random() * 1000), type: 'success' },
    { title: 'Low Stock Alert', message: 'Product running low on stock', type: 'warning' },
    { title: 'Payment Received', message: 'Payment of Rp ' + (Math.floor(Math.random() * 5000000) + 1000000).toLocaleString(), type: 'success' },
    { title: 'New Lead', message: 'Hot lead from potential client', type: 'info' },
    { title: 'System Update', message: 'System maintenance completed', type: 'info' }
  ]

  setInterval(() => {
    if (clients.size > 0 && Math.random() > 0.7) { // 30% chance every minute
      const notification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)]
      sendNotification(notification.type, {
        title: notification.title,
        message: notification.message,
        description: 'Real-time notification from ERP system'
      }, 'system')
    }
  }, 60000) // Every minute
})

module.exports = app

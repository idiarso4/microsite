const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create Users
  const users = await prisma.user.createMany({
    data: [
      {
        name: 'Admin User',
        email: 'admin@erp.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'admin'
      },
      {
        name: 'Sales Manager',
        email: 'sales@erp.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'user'
      }
    ]
  })

  console.log(`Created ${users.count} users`)

  // Create Categories
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Electronics', description: 'Electronic devices and gadgets' },
      { name: 'Furniture', description: 'Office and home furniture' },
      { name: 'Stationery', description: 'Office supplies and stationery' },
      { name: 'Software', description: 'Software licenses and applications' }
    ]
  })

  console.log(`Created ${categories.count} categories`)

  // Create Products
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Laptop Dell Inspiron 15',
        sku: 'DELL-INS-15-001',
        description: 'High-performance laptop for business use',
        price: 8500000,
        cost: 7000000,
        stock: 45,
        minStock: 10,
        status: 'active',
        categoryId: 1
      },
      {
        name: 'Office Chair Ergonomic',
        sku: 'CHAIR-ERG-001',
        description: 'Comfortable ergonomic office chair',
        price: 1250000,
        cost: 900000,
        stock: 8,
        minStock: 15,
        status: 'low_stock',
        categoryId: 2
      },
      {
        name: 'Wireless Mouse Logitech',
        sku: 'MOUSE-LOG-001',
        description: 'Wireless optical mouse',
        price: 275000,
        cost: 200000,
        stock: 120,
        minStock: 25,
        status: 'active',
        categoryId: 1
      },
      {
        name: 'Pen Set Ballpoint',
        sku: 'PEN-BALL-001',
        description: 'Set of 12 ballpoint pens, blue ink',
        price: 25000,
        cost: 15000,
        stock: 150,
        minStock: 30,
        status: 'active',
        categoryId: 3
      },
      {
        name: 'Microsoft Office 365',
        sku: 'MS-OFF-365',
        description: 'Annual subscription for Microsoft Office 365',
        price: 1200000,
        cost: 1000000,
        stock: 0,
        minStock: 5,
        status: 'out_of_stock',
        categoryId: 4
      }
    ]
  })

  console.log(`Created ${products.count} products`)

  // Create Customers
  const customers = await prisma.customer.createMany({
    data: [
      {
        name: 'Budi Santoso',
        company: 'PT Teknologi Maju',
        email: 'budi@teknologimaju.com',
        phone: '+62 812-3456-7890',
        address: 'Jl. Sudirman No. 123, Jakarta'
      },
      {
        name: 'Siti Nurhaliza',
        company: 'CV Berkah Jaya',
        email: 'siti@berkahjaya.com',
        phone: '+62 813-9876-5432',
        address: 'Jl. Gatot Subroto No. 456, Bandung'
      },
      {
        name: 'Ahmad Rahman',
        company: 'PT Solusi Digital',
        email: 'ahmad@solusidigitak.com',
        phone: '+62 814-1122-3344',
        address: 'Jl. Thamrin No. 789, Surabaya'
      }
    ]
  })

  console.log(`Created ${customers.count} customers`)

  // Create Leads
  const leads = await prisma.lead.createMany({
    data: [
      {
        company: 'PT Teknologi Maju',
        contactName: 'Budi Santoso',
        email: 'budi@teknologimaju.com',
        phone: '+62 812-3456-7890',
        status: 'hot',
        value: 250000000,
        stage: 'proposal',
        lastContact: new Date('2024-01-20'),
        notes: 'Interested in bulk laptop purchase for new office',
        assignedToId: 1
      },
      {
        company: 'CV Berkah Jaya',
        contactName: 'Siti Nurhaliza',
        email: 'siti@berkahjaya.com',
        phone: '+62 813-9876-5432',
        status: 'warm',
        value: 75000000,
        stage: 'negotiation',
        lastContact: new Date('2024-01-18'),
        notes: 'Looking for office furniture package',
        assignedToId: 1
      },
      {
        company: 'PT Solusi Digital',
        contactName: 'Ahmad Rahman',
        email: 'ahmad@solusidigitak.com',
        phone: '+62 814-1122-3344',
        status: 'cold',
        value: 15000000,
        stage: 'initial_contact',
        lastContact: new Date('2024-01-15'),
        notes: 'Initial inquiry about software licenses',
        assignedToId: 2
      }
    ]
  })

  console.log(`Created ${leads.count} leads`)

  // Create Orders
  const orders = await prisma.order.createMany({
    data: [
      {
        orderNumber: 'ORD-2024-001',
        status: 'completed',
        totalAmount: 8525000,
        orderDate: new Date('2024-01-15'),
        customerId: 1,
        createdById: 1
      },
      {
        orderNumber: 'ORD-2024-002',
        status: 'processing',
        totalAmount: 1275000,
        orderDate: new Date('2024-01-20'),
        customerId: 2,
        createdById: 1
      },
      {
        orderNumber: 'ORD-2024-003',
        status: 'pending',
        totalAmount: 325000,
        orderDate: new Date('2024-01-22'),
        customerId: 3,
        createdById: 1
      }
    ]
  })

  console.log(`Created ${orders.count} orders`)

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

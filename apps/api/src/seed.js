const { PrismaClient } = require('./generated/prisma')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Clear existing data
    await prisma.activity.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.customer.deleteMany()
    await prisma.stockMovement.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.lead.deleteMany()
    await prisma.user.deleteMany()

    // Create users
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'admin@erp.com',
          password: hashedPassword,
          name: 'Admin User',
          role: 'admin'
        }
      }),
      prisma.user.create({
        data: {
          email: 'manager@erp.com',
          password: hashedPassword,
          name: 'Manager User',
          role: 'manager'
        }
      }),
      prisma.user.create({
        data: {
          email: 'sales@erp.com',
          password: hashedPassword,
          name: 'Sales User',
          role: 'user'
        }
      })
    ])

    console.log('✅ Users created')

    // Create categories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Electronics',
          description: 'Electronic devices and accessories'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Furniture',
          description: 'Office and home furniture'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Office Supplies',
          description: 'Stationery and office equipment'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Software',
          description: 'Software licenses and subscriptions'
        }
      })
    ])

    console.log('✅ Categories created')

    // Create products
    const products = await Promise.all([
      // Electronics
      prisma.product.create({
        data: {
          name: 'Laptop Dell Inspiron 15',
          sku: 'DELL-INS-15-001',
          description: 'Dell Inspiron 15 3000 Series laptop with Intel Core i5',
          price: 8500000,
          cost: 7000000,
          stock: 45,
          minStock: 10,
          categoryId: categories[0].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Wireless Mouse Logitech',
          sku: 'LOG-MOUSE-001',
          description: 'Logitech M705 Marathon wireless mouse',
          price: 350000,
          cost: 250000,
          stock: 120,
          minStock: 25,
          categoryId: categories[0].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Printer HP LaserJet',
          sku: 'HP-LJ-001',
          description: 'HP LaserJet Pro M404n monochrome printer',
          price: 3200000,
          cost: 2500000,
          stock: 2,
          minStock: 5,
          categoryId: categories[0].id
        }
      }),
      // Furniture
      prisma.product.create({
        data: {
          name: 'Office Chair Ergonomic',
          sku: 'CHAIR-ERG-001',
          description: 'Ergonomic office chair with lumbar support',
          price: 1250000,
          cost: 900000,
          stock: 8,
          minStock: 15,
          categoryId: categories[1].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Desk Lamp LED',
          sku: 'LAMP-LED-001',
          description: 'Adjustable LED desk lamp with USB charging',
          price: 450000,
          cost: 300000,
          stock: 67,
          minStock: 20,
          categoryId: categories[1].id
        }
      }),
      // Office Supplies
      prisma.product.create({
        data: {
          name: 'Paper A4 Ream',
          sku: 'PAPER-A4-001',
          description: 'A4 copy paper 80gsm, 500 sheets per ream',
          price: 45000,
          cost: 35000,
          stock: 200,
          minStock: 50,
          categoryId: categories[2].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Pen Set Ballpoint',
          sku: 'PEN-BALL-001',
          description: 'Set of 12 ballpoint pens, blue ink',
          price: 25000,
          cost: 15000,
          stock: 150,
          minStock: 30,
          categoryId: categories[2].id
        }
      })
    ])

    console.log('✅ Products created')

    // Create customers
    const customers = await Promise.all([
      prisma.customer.create({
        data: {
          name: 'Budi Santoso',
          email: 'budi@teknologimaju.com',
          phone: '+62 812-3456-7890',
          address: 'Jl. Sudirman No. 123, Jakarta',
          company: 'PT Teknologi Maju'
        }
      }),
      prisma.customer.create({
        data: {
          name: 'Sari Dewi',
          email: 'sari@digitalsolutions.com',
          phone: '+62 813-9876-5432',
          address: 'Jl. Gatot Subroto No. 456, Jakarta',
          company: 'CV Digital Solutions'
        }
      }),
      prisma.customer.create({
        data: {
          name: 'Ahmad Rahman',
          email: 'ahmad@inovasibisnis.com',
          phone: '+62 814-5555-1234',
          address: 'Jl. Thamrin No. 789, Jakarta',
          company: 'PT Inovasi Bisnis'
        }
      }),
      prisma.customer.create({
        data: {
          name: 'Lisa Permata',
          email: 'lisa@suksesmandiri.com',
          phone: '+62 815-7777-8888',
          address: 'Jl. Kuningan No. 321, Jakarta',
          company: 'CV Sukses Mandiri'
        }
      })
    ])

    console.log('✅ Customers created')

    // Create leads
    const leads = await Promise.all([
      prisma.lead.create({
        data: {
          company: 'PT Teknologi Maju',
          contactName: 'Budi Santoso',
          email: 'budi@teknologimaju.com',
          phone: '+62 812-3456-7890',
          status: 'hot',
          value: 250000000,
          stage: 'proposal',
          lastContact: new Date('2024-01-15'),
          assignedToId: users[1].id
        }
      }),
      prisma.lead.create({
        data: {
          company: 'CV Digital Solutions',
          contactName: 'Sari Dewi',
          email: 'sari@digitalsolutions.com',
          phone: '+62 813-9876-5432',
          status: 'warm',
          value: 150000000,
          stage: 'negotiation',
          lastContact: new Date('2024-01-14'),
          assignedToId: users[2].id
        }
      }),
      prisma.lead.create({
        data: {
          company: 'PT Inovasi Bisnis',
          contactName: 'Ahmad Rahman',
          email: 'ahmad@inovasibisnis.com',
          phone: '+62 814-5555-1234',
          status: 'cold',
          value: 75000000,
          stage: 'qualification',
          lastContact: new Date('2024-01-12'),
          assignedToId: users[2].id
        }
      }),
      prisma.lead.create({
        data: {
          company: 'CV Sukses Mandiri',
          contactName: 'Lisa Permata',
          email: 'lisa@suksesmandiri.com',
          phone: '+62 815-7777-8888',
          status: 'hot',
          value: 320000000,
          stage: 'closing',
          lastContact: new Date('2024-01-15'),
          assignedToId: users[1].id
        }
      })
    ])

    console.log('✅ Leads created')
    console.log('🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

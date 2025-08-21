import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../index'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = express.Router()

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'user' } = req.body

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email, password, and name are required'
      })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'User with this email already exists'
      })
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create user'
    })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email and password are required'
      })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Invalid email or password'
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account Disabled',
        message: 'Your account has been disabled'
      })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Invalid email or password'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to authenticate user'
    })
  }
})

// Get current user profile
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      })
    }

    res.json({
      user
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get user profile'
    })
  }
})

// Update user profile
router.put('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name is required'
      })
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update profile'
    })
  }
})

// Change password
router.put('/change-password', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Current password and new password are required'
      })
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    })

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Current password is incorrect'
      })
    }

    // Hash new password
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { password: hashedNewPassword }
    })

    res.json({
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to change password'
    })
  }
})

export default router

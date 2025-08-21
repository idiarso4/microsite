import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../index'

export interface AuthRequest extends Request {
  user?: {
    id: number
    email: string
    name: string
    role: string
  }
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    // Get user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    })

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'User not found or inactive'
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(403).json({
      error: 'Invalid token',
      message: 'Token verification failed'
    })
  }
}

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Insufficient permissions'
      })
    }

    next()
  }
}

export const requireAdmin = requireRole(['admin'])
export const requireManagerOrAdmin = requireRole(['admin', 'manager'])

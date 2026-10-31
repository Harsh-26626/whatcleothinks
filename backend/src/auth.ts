import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from './types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_whatcleothinks_min_32_characters';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d', algorithm: 'HS256' });
}

export function verifyToken(token: string): { sub: string } {
  return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as { sub: string };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Authentication required',
    });
  }

  const token = authHeader.slice(7).trim();
  try {
    const payload = verifyToken(token);
    if (!payload || !payload.sub) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Invalid authentication token',
      });
    }
    req.userId = payload.sub;
    next();
  } catch (_err) {
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Invalid or expired authentication token',
    });
  }
}


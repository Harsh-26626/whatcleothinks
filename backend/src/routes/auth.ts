import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { hashPassword, comparePassword, generateToken, requireAuth } from '../auth.js';
import { AuthenticatedRequest } from '../types.js';

export const authRouter = Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'rate_limited',
    message: 'Too many attempts. Please wait a minute and try again.',
  },
});

authRouter.use('/signup', authLimiter);
authRouter.use('/login', authLimiter);

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      const emailIssue = parsed.error.issues.find((i) => i.path.includes('email'));
      if (emailIssue) {
        return res.status(400).json({
          error: 'invalid_email',
          message: 'Please provide a valid email address.',
        });
      }
      const passIssue = parsed.error.issues.find((i) => i.path.includes('password'));
      if (passIssue) {
        return res.status(400).json({
          error: 'weak_password',
          message: 'Password must be at least 8 characters long.',
        });
      }
      return res.status(400).json({
        error: 'invalid_input',
        message: 'Invalid email or password.',
      });
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'email_taken',
        message: 'An account with this email already exists.',
      });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
      },
    });

    const token = generateToken(user.id);
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'invalid_credentials',
        message: 'Invalid email or password.',
      });
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(400).json({
        error: 'invalid_credentials',
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        error: 'invalid_credentials',
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user.id);
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

authRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'User no longer exists.',
      });
    }

    return res.status(200).json({
      id: user.id,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
});


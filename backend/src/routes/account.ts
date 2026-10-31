import { Router, Response, NextFunction } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth } from '../auth.js';
import { AuthenticatedRequest } from '../types.js';

export const accountRouter = Router();

accountRouter.delete('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    await prisma.user.delete({
      where: { id: userId },
    });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

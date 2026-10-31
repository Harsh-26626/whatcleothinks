import { Router, Request, Response } from 'express';
import { PERSONAS } from '../personas.js';

export const personasRouter = Router();

personasRouter.get('/', (_req: Request, res: Response) => {
  const list = PERSONAS.map(({ id, name, tagline, available }) => ({
    id,
    name,
    tagline,
    available,
  }));
  res.status(200).json(list);
});

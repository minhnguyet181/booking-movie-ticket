import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { UserRepository } from '../repositories/user.repository';

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const user = await UserRepository.findById(req.userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.role !== 'admin') {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

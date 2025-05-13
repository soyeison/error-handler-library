import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '../types/exception/unauthorized.exception';

export const authMiddleware = (secret: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.token as string;
    if (!authHeader) {
      throw new UnauthorizedException('Debe pasar un token valido');
    }

    try {
      const payload = jwt.verify(authHeader, secret);
      (req as any).user = payload;
    } catch (error) {
      throw new UnauthorizedException('Token invalido');
    }
  };
};

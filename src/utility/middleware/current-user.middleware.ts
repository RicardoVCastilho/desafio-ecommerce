import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'; 

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity | null;
    }
  }
}

interface jwtPayload {
  id: string;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || Array.isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
      req.currentUser = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.ACCESS_TOKEN_SECRET_KEY;

    if (!secret) {
      throw new Error('ACCESS_TOKEN_SECRET_KEY is not defined');
    }

    try {
      const { id } = verify(token, secret) as jwtPayload;
      const currentUser = await this.usersService.findOne(+id);
      req.currentUser = currentUser;
    } catch (error) {
      req.currentUser = null;
    }

    return next();
  }
}

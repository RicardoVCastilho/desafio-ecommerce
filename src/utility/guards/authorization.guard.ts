import { CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<string[]>(
      'allowedRoles',
      context.getHandler(),
    );

    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRoles: string[] = request?.currentUser?.role;


    if (!userRoles || userRoles.length === 0) {
      throw new UnauthorizedException('Usuário sem papéis definidos.');
    }

    const hasAccess = userRoles.some((role) =>
      allowedRoles.includes(role),
    );

    if (hasAccess) return true;

    throw new UnauthorizedException(
      'Desculpe, você não está autorizado.',
    );
  }
}

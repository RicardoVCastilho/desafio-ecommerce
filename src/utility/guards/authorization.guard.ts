import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Type, mixin } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export function AuthorizeGuard(allowedRoles: string[]): Type<CanActivate> {
  @Injectable()
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const userRoles: string[] = request?.currentUser?.role;

      if (!userRoles || userRoles.length === 0) {
        throw new UnauthorizedException('Usuário sem papéis definidos.');
      }

      const hasAccess = userRoles.some((role) => allowedRoles.includes(role));

      if (hasAccess) return true;

      throw new UnauthorizedException('Desculpe, você não está autorizado.');
    }
  }

  return mixin(RolesGuardMixin);
}

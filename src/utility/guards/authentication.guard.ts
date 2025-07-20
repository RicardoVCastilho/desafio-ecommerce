import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.currentUser) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    return true;
  }
}

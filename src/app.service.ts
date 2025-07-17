import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Olá, seja bem vindo a minha API de E-commerce!';
  }
}

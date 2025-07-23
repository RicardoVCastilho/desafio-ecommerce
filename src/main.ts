import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  // Swagger Configuração
  const config = new DocumentBuilder()
    .setTitle('API - Ecommerce do desafio da Loomi') 
    .setDescription('Documentação da API Ecommerce do desafio da Loomi')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Rota da documentação

  const dataSource = app.get(DataSource);
  if (!dataSource.isInitialized) {
    try {
      await dataSource.initialize();
      Logger.log('Conexão com o banco de dados estabelecida com sucesso!', 'Bootstrap');
    } catch (error) {
      Logger.error('Falha ao conectar com o banco de dados', error, 'Bootstrap');
      process.exit(1);
    }
  } else {
    Logger.log('Conexão com o banco de dados já estava estabelecida.', 'Bootstrap');
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(`Servidor rodando na porta ${port}`, 'Bootstrap');
  Logger.log(`Swagger disponível em http://localhost:${port}/api/docs`, 'Swagger');
}

bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

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
}
bootstrap();

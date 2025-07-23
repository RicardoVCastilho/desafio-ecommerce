import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do cliente',
  })
  @IsNotEmpty({ message: 'O nome completo é obrigatório.' })
  @IsString({ message: 'O nome completo deve ser um texto.' })
  fullName: string;

  @ApiProperty({
    example: '+55 11 91234-5678',
    description: 'Contato do cliente (telefone, WhatsApp, etc)',
  })
  @IsNotEmpty({ message: 'O contato é obrigatório.' })
  @IsString({ message: 'O contato deve ser um texto.' })
  contact: string;

  @ApiProperty({
    example: 'Rua Exemplo, 123 - Bairro, Cidade/UF',
    description: 'Endereço completo do cliente',
  })
  @IsNotEmpty({ message: 'O endereço é obrigatório.' })
  @IsString({ message: 'O endereço precisa ser um texto.' })
  address: string;

  @ApiProperty({
    example: 3,
    description: 'ID do usuário associado ao cliente',
  })
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório.' })
  @IsNumber({}, { message: 'O ID do usuário deve ser um número.' })
  userId: number;

  @ApiProperty({
    example: true,
    required: false,
    description: 'Indica se o cliente está ativo',
  })
  @IsBoolean({ message: 'O campo isActive deve ser True or False.' })
  isActive?: boolean;
}

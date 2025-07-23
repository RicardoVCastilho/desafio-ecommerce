import { ApiProperty } from '@nestjs/swagger';

export class ClientResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID único do cliente',
  })
  id: number;

  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do cliente',
  })
  fullName: string;

  @ApiProperty({
    example: '+55 11 91234-5678',
    description: 'Contato do cliente',
  })
  contact: string;

  @ApiProperty({
    example: 'Rua Exemplo, 123 - Bairro, Cidade/UF',
    description: 'Endereço completo do cliente',
  })
  address: string;

  @ApiProperty({
    example: true,
    description: 'Indica se o cliente está ativo',
  })
  isActive: boolean;

  @ApiProperty({
    example: {
      id: 3,
      name: 'João',
      email: 'joao@email.com',
    },
    description: 'Informações do usuário responsável por esse cliente',
  })
  user: {
    id: number;
    name: string;
    email: string;
  };

  @ApiProperty({
    example: '2025-07-23T12:34:56.789Z',
    description: 'Data de criação do cliente',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-07-23T14:00:00.000Z',
    description: 'Última atualização dos dados do cliente',
  })
  updatedAt: Date;
}

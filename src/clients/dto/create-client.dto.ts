import { IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty({ message: 'O nome completo é obrigatório.' })
  @IsString({ message: 'O nome completo deve ser um texto.' })
  fullName: string;

  @IsNotEmpty({ message: 'O contato é obrigatório.' })
  @IsString({ message: 'O contato deve ser um texto.' })
  contact: string;

  @IsNotEmpty({ message: 'O endereço é obrigatório.' })
  @IsString({ message: 'O endereço precisa ser um texto.' })
  address: string;

  @IsNotEmpty({ message: 'O ID do usuário é obrigatório.' })
  @IsNumber({}, { message: 'O ID do usuário deve ser um número.' })
  userId: number;

  @IsBoolean({ message: 'O campo isActive deve ser True or False.' })
  isActive?: boolean;
}

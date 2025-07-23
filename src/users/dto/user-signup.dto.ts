import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UserSignUpDto {
  @ApiProperty({ description: 'Nome completo do usuário.', example: 'João da Silva' })
  @IsNotEmpty({ message: 'É obrigatório preencher o nome.' })
  @IsString({ message: 'O nome precisa ser um texto.' })
  name: string;

  @ApiProperty({ description: 'Endereço de e-mail do usuário', example: 'joao.silva@gmail.com', format: 'email' })
  @IsNotEmpty({ message: 'É obrigatório preencher um endereço de e-mail.' })
  @IsEmail({}, { message: 'Por favor, informa um endereço de e-mail válido.' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário (mínimo 5 caracteres)', example: 'Joao123', minLength: 5 })
  @IsNotEmpty({ message: 'É obrigatório preencher a senha.' })
  @MinLength(5, { message: 'A senha exige um mínimo de 5 caracteres.' })
  password: string;
}

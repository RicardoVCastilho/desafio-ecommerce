import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserSignUpDto {
  @IsNotEmpty({ message: 'É obrigatório preencher o nome.' })
  @IsString({ message: 'O nome precisa ser um texto.' })
  name: string;

  @IsNotEmpty({ message: 'É obrigatório preencher um endereço de e-mail.' })
  @IsEmail({}, { message: 'Por favor, informa um endereço de e-mail válido.' })
  email: string;

  @IsNotEmpty({ message: 'É obrigatório preencher a senha.' })
  @MinLength(5, { message: 'A senha exige um mínimo de 5 caracteres.' })
  password: string;
}

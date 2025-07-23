import {IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class UserSignInDto {
        @ApiProperty({ description: 'Endereço de e-mail do usuário' })
        @IsNotEmpty({message: 'É obrigatório preencher um endereço de e-mail.'})
        @IsEmail({}, {message: 'Por favor, informa um endereço de e-mail válido.'})
        email:string;
    
        @ApiProperty({ description: 'Senha do usuário (mínimo 5 caracteres)' })
        @IsNotEmpty({message: 'É obrigatório preencher a senha.'})
        @MinLength(5, {message: 'A senha exige um mínimo de 5 caracteres.'})
        password:string;
}
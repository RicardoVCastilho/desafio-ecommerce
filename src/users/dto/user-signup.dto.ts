import {IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserSignInDto } from "./user-signin.dto";

export class UserSignUpDto extends UserSignInDto{
    @IsNotEmpty({message: 'É obrigatório preencher o nome.'})
    @IsString({message: 'O nome precisa ser um texto.'})
    name:string;
}
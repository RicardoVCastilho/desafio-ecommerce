import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'É obrigatório preencher um título da categoria.' })
    @IsString({ message: 'O título precisa ser um texto.' })
    title: string;

    @IsNotEmpty({ message: 'É obrigatório preencher uma descrição para a categoria.' })
    @IsString({ message: 'A categoria precisa ser um texto.' })
    description: string;
}

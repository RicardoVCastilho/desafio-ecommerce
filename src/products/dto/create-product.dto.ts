import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({ message: 'O título do produto não pode estar vazio.' })
    @IsString()
    name: string;

    @IsNotEmpty({ message: 'A descrição do produto não pode estar vazio(a).' })
    @IsString()
    description: string;

    @IsNotEmpty({ message: 'O preço do produto não pode estar vazio(a).' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O preço deve ser um número e só pode ter duas casas decimais.' })
    @IsPositive({ message: 'O preço precisa ser um número positivo.' })
    price: number;

    @IsNotEmpty({ message: 'A quantidade do produto não pode estar vazio(a).' })
    @IsNumber({}, { message: 'A quantidade precisa ser um número.' })
    @Min(0, { message: 'A quantidade no estoque não pode ser negativo.' })
    quantity: number;

    @IsNotEmpty({ message: 'A imagem não pode estar vazio(a).' })
    @IsArray({ message: 'Imagens deve ser salva em formato de array.' })
    images: string[];

    @IsNotEmpty({ message: 'A categoria não pode estar vazio(a).' })
    @IsNumber({}, { message: 'Id da categoria deve ser um número.' })
    categoryId: number;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ example: 'Smartphone XYZ', description: 'Nome do produto' })
    @IsNotEmpty({ message: 'O título do produto não pode estar vazio.' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Smartphone com tela 6.5 polegadas', description: 'Descrição do produto' })
    @IsNotEmpty({ message: 'A descrição do produto não pode estar vazio(a).' })
    @IsString()
    description: string;

    @ApiProperty({ example: 1999.99, description: 'Preço do produto' })
    @IsNotEmpty({ message: 'O preço do produto não pode estar vazio(a).' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O preço deve ser um número e só pode ter duas casas decimais.' })
    @IsPositive({ message: 'O preço precisa ser um número positivo.' })
    price: number;

    @ApiProperty({ example: 10, description: 'Quantidade disponível em estoque' })
    @IsNotEmpty({ message: 'A quantidade do produto não pode estar vazio(a).' })
    @IsNumber({}, { message: 'A quantidade precisa ser um número.' })
    @Min(0, { message: 'A quantidade no estoque não pode ser negativo.' })
    quantity: number;

    @ApiProperty({ example: ['img1.jpg', 'img2.jpg'], description: 'Lista de URLs das imagens' })
    @IsNotEmpty({ message: 'A imagem não pode estar vazio(a).' })
    @IsArray({ message: 'Imagens deve ser salva em formato de array.' })
    images: string[];

    @ApiProperty({ example: 1, description: 'ID da categoria à qual o produto pertence' })
    @IsNotEmpty({ message: 'A categoria não pode estar vazio(a).' })
    @IsNumber({}, { message: 'Id da categoria deve ser um número.' })
    categoryId: number;
}

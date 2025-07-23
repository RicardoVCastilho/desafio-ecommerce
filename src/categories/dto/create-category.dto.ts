import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Título da categoria',
    example: 'Eletrônicos',
  })
  @IsNotEmpty({ message: 'É obrigatório preencher um título da categoria.' })
  @IsString({ message: 'O título precisa ser um texto.' })
  title: string;

  @ApiProperty({
    description: 'Descrição da categoria',
    example: 'Categoria para produtos eletrônicos diversos',
  })
  @IsNotEmpty({ message: 'É obrigatório preencher uma descrição para a categoria.' })
  @IsString({ message: 'A categoria precisa ser um texto.' })
  description: string;
}

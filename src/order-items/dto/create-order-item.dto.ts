import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    example: 2,
    description: 'ID do produto',
  })
  @IsNotEmpty({ message: 'O ID do produto é obrigatório.' })
  @IsNumber({}, { message: 'O ID do produto deve ser um número.' })
  productId: number;

  @ApiProperty({
    example: 3,
    description: 'Quantidade do produto',
  })
  @IsNotEmpty({ message: 'A quantidade é obrigatória.' })
  @IsNumber({}, { message: 'A quantidade deve ser um número.' })
  @Min(1, { message: 'A quantidade mínima é 1.' })
  quantity: number;

  @ApiProperty({
    example: 150.50,
    description: 'Preço unitário do produto',
  })
  @IsNotEmpty({ message: 'O preço por unidade é obrigatório.' })
  @IsNumber({}, { message: 'O preço por unidade deve ser um número.' })
  unitPrice: number;
}

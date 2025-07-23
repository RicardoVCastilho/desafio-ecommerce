import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty({ message: 'O ID do produto é obrigatório.' })
  @IsNumber({}, { message: 'O ID do produto deve ser um número.' })
  productId: number;

  @IsNotEmpty({ message: 'A quantidade é obrigatória.' })
  @IsNumber({}, { message: 'A quantidade deve ser um número.' })
  @Min(1, { message: 'A quantidade mínima é 1.' })
  quantity: number;

  @IsNotEmpty({ message: 'O preço por unidade é obrigatório.' })
  @IsNumber({}, { message: 'O preço por unidade deve ser um número.' })
  unitPrice: number;

  @IsNotEmpty({ message: 'O subtotal é obrigatório.' })
  @IsNumber({}, { message: 'O subtotal deve ser um número.' })
  subtotal: number;
}

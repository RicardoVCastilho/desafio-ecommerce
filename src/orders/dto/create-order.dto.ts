import { IsNotEmpty, IsNumber, IsEnum, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from '../../order-items/dto/create-order-item.dto'; // import do DTO dos itens
import { OrderStatus } from '../../utility/common/order-status.enum';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'O ID do cliente é obrigatório.' })
  @IsNumber({}, { message: 'O ID do cliente deve ser um número.' })
  clientId: number;

  @IsEnum(OrderStatus, { message: 'Status inválido.' })
  status?: OrderStatus; 

  @IsNumber({}, { message: 'O total deve ser um número.' })
  total: number;

  @IsArray({ message: 'Os itens do pedido devem ser uma lista/array.' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

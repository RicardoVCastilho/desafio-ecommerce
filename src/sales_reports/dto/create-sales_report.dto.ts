import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsEnum, IsString } from 'class-validator';
import { OrderStatus } from '../../utility/common/order-status.enum';

export class CreateSalesReportDto {
  @ApiPropertyOptional({ example: '2025-07-01', description: 'Data de início' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-07-31', description: 'Data de término' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ example: 5, description: 'ID do cliente' })
  @IsOptional()
  @IsNumber()
  clientId?: number;

  @ApiPropertyOptional({ example: 12, description: 'ID do produto' })
  @IsOptional()
  @IsNumber()
  productId?: number;

  @ApiPropertyOptional({ example: OrderStatus.PAID, enum: OrderStatus, description: 'Status do pedido' })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

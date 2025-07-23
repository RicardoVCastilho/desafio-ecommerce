import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSalesReportDto {
  @ApiProperty({
    example: '2025-07-01',
    description: 'Data de início do período do relatório (caso queira enviar horário: formato ISO).',
  })
  @IsNotEmpty({ message: 'É obrigatório preencher uma data inicial para o relatório.' })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '2025-07-31',
    description: 'Data de término do período do relatório (caso queira enviar horário: formato ISO).',
  })
  @IsNotEmpty({ message: 'É obrigatório preencher uma data final para o relatório.' })
  @IsDateString()
  endDate: string;
}

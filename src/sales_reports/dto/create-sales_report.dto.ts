import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateSalesReportDto {
    @IsNotEmpty({ message: 'É obrigatório preencher uma data inicial para o relatório.' })
    @IsDateString()
    startDate: string;

    @IsNotEmpty({ message: 'É obrigatório preencher uma data final para o relatório.' })
    @IsDateString()
    endDate: string;
}

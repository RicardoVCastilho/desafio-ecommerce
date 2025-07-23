import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('sales_reports')
export class SalesReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  period: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalSales: number;

  @Column({ type: 'int' })
  productsSold: number;

  @Column()
  filePath: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

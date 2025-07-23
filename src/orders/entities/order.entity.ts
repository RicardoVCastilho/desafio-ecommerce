import { ClientEntity } from "src/clients/entities/clients.entity";
import { OrderItemEntity } from "src/order-items/entities/order-item.entity";
import { OrderStatus } from "src/utility/common/order-status.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from "typeorm";

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClientEntity, { eager: true })
  @JoinColumn({ name: 'client_id' }) 
  client: ClientEntity;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.RECEIVED,
  })
  status: OrderStatus;

  @CreateDateColumn()
  orderDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @OneToMany(() => OrderItemEntity, (item) => item.order, {
    cascade: true,
    eager: true, 
  })
  items: OrderItemEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotal() {
    if (this.items) {
      this.total = this.items.reduce((sum, item) => {
        return sum + Number(item.subtotal);
      }, 0);
    }
  }
}

import { OrderEntity } from "src/orders/entities/order.entity";
import { ProductEntity } from "src/products/entities/product.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'order_items' })
export class OrderItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: OrderEntity;

    @ManyToOne(() => ProductEntity, { eager: true })
    @JoinColumn({ name: 'product_id' })
    product: ProductEntity;

    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unitPrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;

    @BeforeInsert()
    @BeforeUpdate()
    calculateSubtotal() {
        this.subtotal = Number(this.unitPrice) * this.quantity;
    }
}

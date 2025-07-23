import { CategoryEntity } from "../../categories/entities/category.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity({ name: 'products' })
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    price: number;

    @Column()
    quantity: number;

    @Column('simple-array')
    images: string[];

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

@ManyToOne(() => CategoryEntity, (category) => category.products)
category: CategoryEntity;

@ManyToOne(() => UserEntity, (user) => user.products)
addedBy: UserEntity;


}

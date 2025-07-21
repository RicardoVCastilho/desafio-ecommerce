import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity({name:'clients'})
export class ClientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' }) // FK personalizada
  user: UserEntity;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column()
  contact: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

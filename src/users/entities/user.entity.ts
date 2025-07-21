import { CategoryEntity } from "src/categories/entities/category.entity";
import { UserRole } from "src/utility/common/user-roles.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        array: true,
        default: [UserRole.CLIENT]
    })
    role: UserRole[];

    @Column({ default: false })
    isEmailConfirmed: boolean;

    @Column({ type: 'varchar', nullable: true })
    emailConfirmationToken: string | null;

    @Column({ type: 'timestamp', nullable: true })
    emailConfirmationTokenExpires: Date | null;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @OneToMany(()=> CategoryEntity, (cat)=>cat.addedBy)
    categories:CategoryEntity[];
}

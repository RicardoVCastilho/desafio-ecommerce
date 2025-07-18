import { UserRole } from "src/utility/common/user-roles.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity {
@PrimaryGeneratedColumn()
id:number;

@Column()
name:string;

@Column({unique:true})
email:string;

@Column({select:false})
password:string;

@Column({
    type: 'enum',
    enum:UserRole,
    array:true,
    default:[UserRole.CLIENT]
})
role: UserRole[];

@CreateDateColumn()
createdAt:Timestamp;

@UpdateDateColumn()
updatedAt:Timestamp;
}

import { UserRole } from "src/utility/common/user-roles.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UserEntity {
@PrimaryGeneratedColumn()
id:number;

@Column()
name:string;

@Column({unique:true})
email:string;

@Column()
password:string;

@Column({
    type: 'enum',
    enum:UserRole,
    array:true,
    default:[UserRole.CLIENT]
})
role: UserRole[];
}

import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { userRole } from "./enums/role.enum";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "varchar",
        nullable: false,
        length: 100,
        unique: true
    })
    username: string

    @Column({
        type: "varchar",
        nullable: false,
        length: 100,
        unique: true
    })
    email: string

    @Column({
        type: "varchar",
        nullable: false,
        length: 100
    })
    password: string

    @Column({
        type: "enum",
        enum: userRole,
        default: userRole.MEMBER,
    })
    role: userRole;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(){
        if(this.password){
            this.password = await bcrypt.hash(this.password,10)
        }
    }
}
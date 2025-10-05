import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User{

    @PrimaryGeneratedColumn()
    id:number

    @Column({
        type:"varchar",
        nullable:false,
        length:30,
        unique:true
    })
    username:string

    @Column({
        type:"varchar",
        nullable:false,
        length:30,
        unique:true
    })
    email:string

    @Column({
        type:"varchar",
        nullable:false,
        length:30
    })
    password:string
    
    @Column({
        type:"varchar",
        nullable:false,
        length:6
    })
    role : string = "MEMBER"

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date

    @DeleteDateColumn()
    deletedAt:Date

}
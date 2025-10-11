import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Invite {
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        type: "varchar",
        nullable: false,
        length: 100
    })
    email:string

    @Column({
        type: "varchar",
        nullable: false,
        length: 100
    })
    token:string

    @Column({
        type:"boolean",
        default:false
    })
    isUsed:boolean

    @CreateDateColumn()
    createdAt:Date

    @Column({
        type:"timestamp",
        nullable:false
    })
    expiresAt:Date
}


import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "int",
        nullable: false
    })
    workspaceId:number

    @Column({
        type: "int",
        nullable: false
    })
    senderId:number

    @Column({
        type: "int",
        nullable: false
    })
    receiverId:number

    @Column({
        type: "varchar",
        nullable: false
    })
    message:string

    @CreateDateColumn()
    createdAt:Date
}
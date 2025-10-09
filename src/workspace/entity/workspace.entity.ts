import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Workspace{

    @PrimaryGeneratedColumn()
    id:number

    @Column({
        type:"varchar",
        nullable:false,
        unique:true
    })
    name:string

    @Column({
        type:"varchar",
        nullable:true
    })
    description:string
}

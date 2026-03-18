import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WorkspaceInvite{
    @PrimaryGeneratedColumn()
    id :number;
    
   @Column({
    type:'varchar',
    nullable:false,
    length:100
   })
   email:string;

   @Column({
    type:'varchar',
    nullable:false,
    length:100
   })
   token:string;

   @Column({
    type:"int",
    nullable:false
   })
   workspaceId:number;

   @Column({
    type:"boolean",
    default:false
   })
   isAccepted:boolean;

   @CreateDateColumn()
   createdAt:Date;

    @Column({
        type:"timestamp",
        nullable:false
    })
    expiresAt:Date

}
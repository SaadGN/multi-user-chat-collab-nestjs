import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { ManyToOne } from "typeorm/browser";
import { Workspace } from "./workspace.entity";




@Entity()
export class WorkspaceMember{
    @PrimaryGeneratedColumn()
    id :number;
    
    @ManyToOne(()=> User)
    @JoinColumn({ name :'user_id'})
    user:User;

    @ManyToOne(()=> Workspace)
    @JoinColumn({ name :'workspace_id'})
    workpsace:Workspace;

    @Column({default:'member'})
    role:string;

    @CreateDateColumn()
    createdAt: Date

}
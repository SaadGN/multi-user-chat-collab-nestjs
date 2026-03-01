import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { ManyToOne } from "typeorm";
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
    workspace:Workspace;

    @Column({default:'MEMBER'})
    role:string;

    @CreateDateColumn()
    createdAt: Date

}
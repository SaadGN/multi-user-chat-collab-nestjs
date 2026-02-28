import { User } from "src/user/user.entity";
import { Workspace } from "src/workspace/entity/workspace.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { ManyToOne } from "typeorm/browser";



@Entity()
export class WorkspaceInvite{
    @PrimaryGeneratedColumn()
    id :number;
    
    @ManyToOne(()=> Workspace)
    @JoinColumn({ name :'workspace_id'})
    workpsace:Workspace;
    
    @ManyToOne(()=> User)
    @JoinColumn({ name :'user_id'})
    user:User;


    @Column({default:'pending'})
    status:string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({
        type:"timestamp",
        nullable:false
    })
    expiresAt:Date

}
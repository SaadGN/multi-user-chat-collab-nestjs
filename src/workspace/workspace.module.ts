import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entity/workspace.entity';
import { JwtModule } from '@nestjs/jwt';
import authConfig from 'src/config/auth.config';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  imports: [
    TypeOrmModule.forFeature([Workspace]),
    JwtModule.registerAsync(authConfig.asProvider())

  ]
})
export class WorkspaceModule { }

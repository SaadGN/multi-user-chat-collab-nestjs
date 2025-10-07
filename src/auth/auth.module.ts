import { Module } from '@nestjs/common';
import { AdminController } from 'src/admin/admin.controller';
import { AdminService } from 'src/admin/admin.service';

@Module({
    controllers:[AdminController],
    providers:[AdminService],
})
export class AuthModule {}

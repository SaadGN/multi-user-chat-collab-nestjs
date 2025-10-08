import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import dbConfig from './config/db.config';
import dotenv from "dotenv";
import { AdminService } from './admin/admin.service';
import { AuthModule } from './auth/auth.module';
dotenv.config()

@Module({
  imports: [
    UserModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [dbConfig],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        database: configService.get('database.name'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        synchronize: true,
        autoLoadEntities: true,
      })
    }),

    AdminModule,

    AuthModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements OnModuleInit {

  constructor(
    private readonly adminService: AdminService
  ) { }

  async onModuleInit() {
    await this.adminService.createDefaultAdmin()
  }
}

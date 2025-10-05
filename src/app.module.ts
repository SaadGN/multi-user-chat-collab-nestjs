import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import appConfig from './config/app.config';
import dbConfig from './config/db.config';
import dotenv from "dotenv";
dotenv.config()

@Module({
  imports: [UserModule,
    
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
        database:configService.get('database.name'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        synchronize: true,
        autoLoadEntities: true,
      })
    })


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

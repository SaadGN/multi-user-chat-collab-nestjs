import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    environment: process.env.ENV_MODE,
    type: process.env.DB_TYPE ,
    host: process.env.DB_HOST ,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    name: process.env.DB_NAME ,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ,
    synchronize: process.env.DB_SYNCHRONIZE ,
    autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES,
}))
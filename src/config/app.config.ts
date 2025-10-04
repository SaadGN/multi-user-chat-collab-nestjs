import { registerAs } from "@nestjs/config";

export default registerAs('databse',() => ({
    environment:  process.env.ENV_NODE || 'production'
}))
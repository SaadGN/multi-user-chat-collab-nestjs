import { registerAs } from "@nestjs/config";

export default registerAs('database',() => ({
    environment:  process.env.ENV_MODE || 'production'
}))
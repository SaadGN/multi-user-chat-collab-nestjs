import { registerAs } from "@nestjs/config";

export default registerAs('auth',() => ({
    secret:process.env.JWT_TOKEN_SECRET,
    expiresIn:process.env.JWT_TOKEN_EXPIRESIN,
    issuer:process.env.JWT_TOKEN_ISSUER,
    audience:process.env.JWT_TOKEN_AUDIENCE
}))

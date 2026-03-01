import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";
import authConfig from "src/config/auth.config";
import { REQ_USER } from "src/constants/user.constant";

@Injectable()
export class AuthorizeGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,

        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>,

        private readonly reflector: Reflector
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        // check if route is public
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass()
        ])
        if (isPublic) {
            return true
        }

        
        //role check
        const roleCheck = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass()
        ])

        //extract request from context
        const request: Request = context.switchToHttp().getRequest()

        //extract token from request
        const authHeader = request.headers.authorization
        const token = authHeader?.split(' ')[1]

        if (!token) {
            throw new UnauthorizedException('No token provided')
        }

        let payload: any;
        try {
            //verify token
            payload = await this.jwtService.verifyAsync(token, {
                secret: this.authConfiguration.secret,
                issuer: this.authConfiguration.issuer,
                audience: this.authConfiguration.audience,
            }
            )
            request[REQ_USER] = payload

        } catch (error) {
            if (error.name == 'TokenExpiredError') {
                throw new UnauthorizedException('Token Expired.Please login again!')
            }
            if (error.name == 'JsonWebTokenError') {
                throw new UnauthorizedException('Invalid token!')
            }
            throw new UnauthorizedException("Authentication failed")
        }

        console.log('roleCheck:', roleCheck, 'payload.role:', payload.role, 'handler:', context.getHandler().name);

        if (!payload || !payload.role) {
            throw new UnauthorizedException('Invalid token payload')
        }
        if (roleCheck && !roleCheck.includes(payload.role)) {
            throw new ForbiddenException(`Access denied!`)
        }

        return true
    }
}
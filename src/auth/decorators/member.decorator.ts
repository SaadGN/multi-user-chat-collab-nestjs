import { SetMetadata } from "@nestjs/common";
import { userRole } from "src/user/enums/role.enum";


export const MemberDecorator = () => {
    return SetMetadata('roles',[userRole.MEMBER])
}
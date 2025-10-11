import { SetMetadata } from "@nestjs/common"
import { userRole } from "src/user/enums/role.enum"

const roleKey = 'roles'
export const AdminDecorator = () => {
    return SetMetadata(roleKey,[userRole.ADMIN])
}
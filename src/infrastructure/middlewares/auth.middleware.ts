import {NextFunction, Request, Response} from "express"
import {authService} from "../../factory"
import {EnumUserPermission} from "../../domain/enums/user-permission.enum"

export default class AuthMiddleware {
    async validateAuthenticatedRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        await authService.validateAuthenticatedRequest(req)

        next()
    }

    async validateDefaultPermission(req: Request, res: Response, next: NextFunction): Promise<void> {
        await authService.validateUserPermission(req, [EnumUserPermission.DEFAULT])

        next()
    }

    async validateMasterOrAdminPermission(req: Request, res: Response, next: NextFunction): Promise<void> {
        await authService.validateUserPermission(req, [EnumUserPermission.MASTER, EnumUserPermission.ADMIN])

        next()
    }

    async validateMasterUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        await authService.validateUserPermission(req, [EnumUserPermission.MASTER])

        next()
    }
}
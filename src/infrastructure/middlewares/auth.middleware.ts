import {NextFunction, Request, Response} from "express"
import {authService} from "../../utils/factory";
import {EnumUserPermission} from "../../domain/enums/user-permission.enum";

export default class AuthMiddleware {
    async validatePublicView(req: Request, res: Response, next: NextFunction): Promise<void> {
        await authService.validatePublicView(req)

        next()
    }

    async validatePublicLoggedIn(req: Request, res: Response, next: NextFunction): Promise<void> {
        await authService.validateUserAuth(req, [EnumUserPermission.DEFAULT])

        next()
    }

    async validateMasterAdminUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        await authService.validateUserAuth(req, [EnumUserPermission.MASTER, EnumUserPermission.ADMIN])

        next()
    }

    async validateMasterUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        await authService.validateUserAuth(req, [EnumUserPermission.MASTER])

        next()
    }
}
import {NextFunction, Request, Response} from "express";
import {UnauthorizedError} from "../errors/unauthorized-error";
import {authService, googleApiService, userRepository} from "../utils/factory";
import {LoginTicket, TokenPayload} from "google-auth-library";
import {IUser} from "../types/user.types";

export default class AuthMiddleware {
    async verifyAuth(req: Request, res: Response, next: NextFunction) {
        const user = await authService.getLoggedInUser(req)



        next()
    }
}
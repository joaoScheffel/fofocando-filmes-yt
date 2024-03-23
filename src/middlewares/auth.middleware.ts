import {NextFunction, Request, Response} from "express"
import {UnauthorizedError} from "../errors/unauthorized-error"
import {googleApiService, userRepository} from "../utils/factory.utils"
import {LoginTicket, TokenPayload} from "google-auth-library"
import {IUser} from "../interfaces/user.interface"

export default class AuthMiddleware {
    async verifyAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        const token: string = req?.headers?.authorization

        if (!token) {
            throw new UnauthorizedError("Authorization Token not found")
        }

        const ticket: LoginTicket = await googleApiService.getTicketByIdToken(token)

        if (!ticket) {
            throw new UnauthorizedError("User ticket not found")
        }

        const payload: TokenPayload = googleApiService.getPayloadFromTicket(ticket)

        if (!payload || !payload?.sub) {
            throw new UnauthorizedError("User payload not found")
        }

        const user: IUser = await userRepository.findOneBySub(payload?.sub)

        if (!user) {
            throw new UnauthorizedError("User does not exist")
        }

        next()
    }
}
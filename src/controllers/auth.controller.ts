import {Request, Response} from "express";
import {authService, googleApiService} from "../utils/factory";
import {IUser} from "../types/user.types";

export default class AuthController {
    async generateAuthUrl(req: Request, res: Response) {
        const authUrl: string = googleApiService.generateAuthUrl()

        return res.status(200).json({
            message: "Successfully generated auth url",
            authUrl
        })
    }

    async redirectGoogleAuth(req: Request, res: Response) {
        const user: IUser = await authService.validateGoogleAuthRedirect(req)

        return res.status(200).json({
            message: "Successfully find user payload",
            user
        })
    }
}
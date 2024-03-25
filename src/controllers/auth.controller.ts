import {Request, Response} from "express";
import {authService, googleApiService} from "../utils/factory";
import {BadRequestError} from "../errors/bad-request-error";

export default class AuthController {
    async generateAuthUrl(req: Request, res: Response) {
        throw new BadRequestError('Google auth redirect query invalid!')
        const authUrl: string = googleApiService.generateAuthUrl()

        return res.status(200).json({
            message: "Successfully generated auth url",
            authUrl
        })
    }

    async redirectGoogleAuth(req: Request, res: Response) {
        const {user, accessToken} = await authService.validateGoogleAuthRedirect(req)

        return res.status(200).json({
            message: "Successfully logged in user!",
            user,
            accessToken
        })
    }
}
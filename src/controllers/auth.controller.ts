import {Request, Response} from "express"
import {authService, googleApiService} from "../utils/factory"

export default class AuthController {
    async generateAuthUrl(req: Request, res: Response) {
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
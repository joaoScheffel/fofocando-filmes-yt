import {Request, Response} from "express";
import GoogleApiService from "../services/google-api.service";
import {TokenPayload} from "google-auth-library";
import AuthService from "../services/auth.service";

export default class AuthController {
    async generateAuthUrl(req: Request, res: Response) {
        const authUrl: string = new GoogleApiService().generateAuthUrl()

        return res.status(200).json({
            message: "Successfully generated auth url",
            authUrl
        })
    }

    async redirectGoogleAuth(req: Request, res: Response) {
        const payload: TokenPayload = await new AuthService().validateGoogleAuthRedirect(req)

        return res.status(200).json({
            message: "Successfully find user payload",
            payload
        })
    }
}
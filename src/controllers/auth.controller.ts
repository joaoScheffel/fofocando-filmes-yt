import {Request, Response} from "express";
import GoogleApiService from "../services/google-api.service";

export default class AuthController {
    async generateAuthUrl(req: Request, res: Response) {
        const authUrl: string = new GoogleApiService().generateAuthUrl()

        return res.status(200).json({
            message: "Successfully generated auth url",
            authUrl
        })
    }
}
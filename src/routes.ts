import {Router} from "express"
import AuthController from "./controllers/auth.controller";

export default class Routes {
    private routes: Router = Router()

    get mainConfiguration() {
        this.authRoutes()

        return this.routes
    }

    private authRoutes() {
        this.routes.get('/auth/generate-auth', new AuthController().generateAuthUrl)
        this.routes.get('/auth/redirect-google', new AuthController().redirectGoogleAuth)
    }
}
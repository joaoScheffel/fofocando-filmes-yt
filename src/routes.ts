import {Router} from "express"
import {authController} from "./utils/factory"

export default class Routes {
    private routes: Router = Router()

    get mainConfiguration() {
        this.authRoutes()

        return this.routes
    }

    private authRoutes() {
        this.routes.get("/auth/generate-auth", authController.generateAuthUrl.bind(authController))
        this.routes.get("/auth/redirect-google", authController.redirectGoogleAuth.bind(authController))
    }
}
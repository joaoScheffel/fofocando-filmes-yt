import {Router} from "express"
import {authController} from "./utils/factory"
import loggerUtils from "./utils/logger.utils"

export default class Routes {
    private routes: Router = Router()

    get initRoutes() {
        loggerUtils.debug("Setting routes.")
        this.authRoutes()

        loggerUtils.info("Successfully configured routes!")
        return this.routes
    }

    private authRoutes() {
        this.routes.get("/auth/generate-auth", authController.generateAuthUrl.bind(authController))
        this.routes.get("/auth/redirect-google", authController.redirectGoogleAuth.bind(authController))
    }
}
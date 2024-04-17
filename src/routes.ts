import {Router} from "express"
import loggerUtils from "./utils/logger.utils"
import {authController, authMiddleware, userController} from "./factory";
import {multerUserUpdateProfile} from "./infrastructure/middlewares/multer.middleware";

export default class Routes {
    private routes: Router = Router()

    get initRoutes() {
        loggerUtils.debug("Setting routes.")
        this.authRoutes()
        this.userRoutes()

        loggerUtils.info("Successfully configured routes!")
        return this.routes
    }

    private authRoutes() {
        this.routes.get("/auth/generate-auth", authController.generateAuthUrl.bind(authController))
        this.routes.get("/auth/redirect-google", authController.redirectGoogleAuth.bind(authController))
    }

    private userRoutes() {
        this.routes.put("/user/update-profile", authMiddleware.validateAuthenticatedRequest, multerUserUpdateProfile, userController.updateProfile.bind(userController))
    }
}
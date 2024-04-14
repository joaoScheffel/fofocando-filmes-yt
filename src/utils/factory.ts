import Config from "../config/config";
import {RequestLogRepository} from "../infrastructure/repositories/request-log.repository";
import {UserRepository} from "../infrastructure/repositories/user.repository";
import UserService from "../application/services/user.service";
import GoogleApiService from "../application/services/google-api.service";
import AuthMiddleware from "../infrastructure/middlewares/auth.middleware";
import AuthService from "../application/services/auth.service";
import AuthController from "../infrastructure/controllers/auth.controller";

Config.load()

export const requestLogRepository: RequestLogRepository = new RequestLogRepository()

export const userRepository: UserRepository = new UserRepository()

export const userService: UserService = new UserService()

export const googleApiService: GoogleApiService = new GoogleApiService()

export const authMiddleware: AuthMiddleware = new AuthMiddleware()

export const authService: AuthService = new AuthService()

export const authController: AuthController = new AuthController()
import GoogleApiService from "../services/google-api.service";
import AuthController from "../controllers/auth.controller";
import AuthService from "../services/auth.service";
import {UserRepository} from "../repositories/user.repository";
import UserService from "../services/user.service";
import Config from "../config/config";

Config.load()

export const userRepository: UserRepository = new UserRepository()

export const userService: UserService = new UserService()

export const googleApiService: GoogleApiService = new GoogleApiService()

export const authService: AuthService = new AuthService()

export const authController: AuthController = new AuthController()
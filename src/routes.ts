import {Router, Request, Response} from "express"
import {BadRequestError} from "./errors/bad-request-error";
import {ServerError} from "./errors/server-error";

export default class Routes {
    private routes: Router = Router()

    get mainConfiguration() {
        this.authRoutes()

        return this.routes
    }

    private authRoutes() {
        this.routes.get('/auth', (req: Request, res: Response) => {
            return res.status(200).json({"message": "aaa"})
        })
    }
}
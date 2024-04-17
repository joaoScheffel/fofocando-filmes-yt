import {Request, Response} from "express";
import {userService} from "../../factory";

export default class UserController {
    async updateProfile(req: Request, res: Response) {
        const a = userService.updateUser(req)

        return res.status(200).json({
            message: "Successfully generated auth url",
        })
    }
}
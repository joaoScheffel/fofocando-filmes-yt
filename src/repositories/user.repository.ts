import {model, Schema} from "mongoose"
import {IUser} from "../interfaces/user.interface"
import {ServerError} from "../errors/server-error"
import {BadRequestError} from "../errors/bad-request-error"

const userSchema: Schema = new Schema<IUser>({
    userUuid: {
        type: String,
        required: [true, "userUuid in userSchema not found"],
        unique: true
    },
    username: {
        type: String,
        required: [true, "username in userSchema not found"]
    },
    email: {
        type: String,
        required: [true, "email in userSchema not found"],
        unique: true
    },
    photoUrl: {
        type: String,
    },
    userPermission: {
        type: String,
        required: [true, "userPermission in userSchema not found"]
    },
    googleSub: {
        type: String,
        required: [true, "googleSub in userSchema not found"]
    },
    lastActivity: {
        type: Date,
    },
}, {
    timestamps: true
})

const userCollection = model<IUser>("userCollection", userSchema, "users")

export class UserRepository {
    async createNewUser(config: IUser): Promise<IUser> {
        if (!config) {
            throw new ServerError("UserRepository.createNewUser at !config")
        }

        try {
            return await userCollection.create(config)
        } catch (e) {
            throw new BadRequestError(`Error trying insert new user, error log: ${e}`)
        }
    }

    async findOneBySub(sub: string): Promise<IUser> {
        if (!sub) {
            throw new ServerError("UserRepository.findOneBySub at !sub")
        }

        try {
            return await userCollection.findOne({"googleSub": sub})
        } catch (e) {
            throw new BadRequestError(`Error trying findOneBySub, error log ${e}`)
        }
    }
}
import {model, Schema} from "mongoose"
import {IUser} from "../../domain/interfaces/user.interface"
import {ServerError} from "../../domain/errors/server-error"
import {BadRequestError} from "../../domain/errors/bad-request-error"
import {randomUsername} from "../../utils/user.utils"
import {whitelistSchema} from "./whitelist.repository"

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
    randomUsername: {
        type: String,
        required: [true, "randomUsername in userSchema not found"]
    },
    email: {
        type: String,
        required: [true, "email in userSchema not found"],
        unique: true
    },
    photoUrl: {
        type: String,
    },
    currentPermission: {
        type: String,
        required: [true, "currentPermission in userSchema not found"]
    },
    whitelist: {
        type: whitelistSchema,
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
            throw new ServerError("UserRepository.createNewUser at !config", `Config not found at createNewUser, config: ${config}`)
        }

        if (!config?.randomUsername) {
            config.randomUsername = randomUsername()
        }

        try {
            return await userCollection.create(config)
        } catch (e) {
            throw new BadRequestError("UserRepository.createNewUser at catch", "Error trying createNewUser", false, e)
        }
    }

    async findOneByEmail(email: string): Promise<IUser> {
        if (!email) {
            throw new ServerError("UserRepository.findOneByEmail at !email", `Email not found at findOneByEmail, email: ${email}`)
        }

        try {
            return await userCollection.findOne({"email": email})
        } catch (e) {
            throw new BadRequestError("UserRepository.findOneByEmail at catch", "Error trying findOneByEmail", false, e)
        }
    }

    async findOneByUserUuid(userUuid: string): Promise<IUser> {
        if (!userUuid) {
            throw new ServerError("UserRepository.findOneByUserUuid at !userUuid", `userUuid not found at findOneByUserUuid, userUuid: ${userUuid}`)
        }

        try {
            return await userCollection.findOne({userUuid: userUuid})
        } catch (e) {
            throw new BadRequestError("UserRepository.findOneByUserUuid at catch", "Error trying findOneByUserUuid", false, e)
        }
    }
}
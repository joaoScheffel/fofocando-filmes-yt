import multer, {MulterError, StorageEngine} from 'multer'
import { Request, Response, NextFunction } from 'express'
import {ServerError} from "../../domain/errors/server-error"
import {BadRequestError} from "../../domain/errors/bad-request-error"
import {IMulterUpload} from "../../domain/interfaces/multer-upload.interface"

class MulterService {
    private readonly storage: StorageEngine

    constructor() {
        this.storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads/')
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now())
            }
        })
    }

    upload(fields: IMulterUpload[]) {
        const uploader = multer({ storage: this.storage }).fields(fields)

        return (req: Request, res: Response, next: NextFunction) => {
            uploader(req, res, (e: any) => {
                if (e) {
                    return this.handleMulterError(e, next)

                } else {
                    for (let field of fields) {
                        if (!req.files || !req.files[field.name]) {
                            return next(new BadRequestError("MulterService.upload at !req.files[field.name]", `No file provided expected`))
                        }
                    }

                    next()
                }
            })
        }
    }

    handleMulterError(e: any, next: NextFunction) {
        const origin: string = "MulterService.handleMulterError at handling"
        let message = "Internal Server Error"
        let statusCode = 500

        if (e instanceof MulterError) {
            const multerCode = e?.code

            switch (multerCode) {
                case "LIMIT_UNEXPECTED_FILE":
                    message = "Invalid files input"
                    statusCode = 400
                    break

                case "LIMIT_FILE_SIZE":
                    message = "File too large"
                    statusCode = 400
                    break

                case "LIMIT_FILE_COUNT":
                    message = "Too many files"
                    statusCode = 400
                    break

                default:
                    message = "Internal Server Error"
                    statusCode = 400
            }
        }

        if (statusCode === 400) {
            next(new BadRequestError(origin, message))

        } else {
            next(new ServerError(origin, e))
        }
    }
}

export default new MulterService()

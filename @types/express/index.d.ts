import { RequestLogUtils } from '../../src/utils/request-log.utils.ts'
import {Multer} from "multer";

declare global {
    namespace Express {
        interface Request {
            requestUtils: RequestLogUtils,
        }

        interface Response {
            requestUtils: RequestLogUtils
            errorFromValidateErrors: any
        }
    }
}

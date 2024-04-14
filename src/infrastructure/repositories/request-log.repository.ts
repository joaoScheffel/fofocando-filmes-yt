import {model, Schema} from "mongoose"
import {IRequestLog} from "../../domain/interfaces/request-log.interface";
import {EnumRequestEvent} from "../../domain/enums/request/request-event.enum";
import {EnumRequestEndpoint} from "../../domain/enums/request/request-endpoint.enum";
import {EnumRequestMethod} from "../../domain/enums/request/request-method.enum";
import {ServerError} from "../../domain/errors/server-error";
import {BadRequestError} from "../../domain/errors/bad-request-error";

const requestLogSchema: Schema = new Schema<IRequestLog>({
    requestUuid: {
        type: String,
        required: [true, "requestUuid in requestLogSchema not found"],
        unique: true
    },
    event: {
        type: String,
        enum: Object.values(EnumRequestEvent),
        required: [true, "event in requestLogsSchema not found"]
    },
    endpoint: {
        type: String,
        enum: Object.values(EnumRequestEndpoint),
        required: [true, "endpoint in requestLogsSchema not found"]
    },
    requestMethod: {
        type: String,
        enum: Object.values(EnumRequestMethod),
        required: [true, "endpoint in requestLogsSchema not found"]
    },
    requestStartedAt: {
        type: Date,
        required: [true, "requestStartedAt in requestLogsSchema not found"]
    },
    requestUrl: {
        type: String,
        required: [true, "requestUrl in requestLogsSchema not found"]
    },
    requestPath: {
        type: String,
        required: [true, "requestPath in requestLogsSchema not found"]
    },
    requestQuery: {
        type: Object,
        required: [true, "requestQuery in requestLogsSchema not found"]
    },
    requestHeaders: {
        type: Object,
        required: [true, "requestHeaders in requestLogsSchema not found"]
    },
    requestBody: {
        type: Object,
    },
    requestFinishedAt: {
        type: Date,
    },
    responseStatus: {
        type: Number,
    },
    isResponseError: {
        type: Boolean
    }
}, {timestamps: true})

const requestLogCollection = model<IRequestLog>("requestLogCollection", requestLogSchema,  "requestLogs")

export class RequestLogRepository {
    async upsertRequestLog(config: IRequestLog): Promise<IRequestLog> {
        if (!config) {
            throw new ServerError("RequestLogRepository.upsertRequestLog at !config")
        }

        try {
           return await requestLogCollection.findOneAndUpdate({requestUuid: config?.requestUuid},
               {$set: config},
               {upsert: true, new: true, runValidators: true}
           )
       } catch (e) {
            throw new BadRequestError(`Error trying upsert requestLog document, error log ${e}`)
       }
    }
}
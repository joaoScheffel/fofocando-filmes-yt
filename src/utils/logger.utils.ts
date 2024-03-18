import * as winston from "winston"

class Logger {
    private logger: winston.Logger;

    constructor() {
        const upperCaseLevelFormat = winston.format(info => {
            info.level = info.level.toUpperCase();
            return info;
        });

        const consoleFormat = winston.format.combine(
            upperCaseLevelFormat(),
            winston.format.colorize({ all: true }),
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message }) => {
                const date: Date = new Date(timestamp)
                date.setHours(date.getHours() - 3)

                return `[${level}] [${date.toISOString()}]: ${message}`
            }),
        );

        const fileFormat = winston.format.combine(
            upperCaseLevelFormat(),
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message }) => {
                const date: Date = new Date(timestamp)
                date.setHours(date.getHours() - 3)

                return `[${level}] [${date.toISOString()}]: ${message}`
            }),
        );

        this.logger = winston.createLogger({
            level: 'debug',
            transports: [
                new winston.transports.Console({
                    format: consoleFormat,
                }),
                new winston.transports.File({
                    filename: 'backend.log',
                    format: fileFormat,
                }),
            ],
        });
    }

    public info(message: string): void {
        this.logger.log('info', message);
    }

    public error(message: string): void {
        this.logger.log('error', message);
    }

    public warn(message: string): void {
        this.logger.log('warn', message);
    }

    public debug(message: string): void {
        this.logger.log('debug', message);
    }
}

export default new Logger();
import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

declare const errorHandler: ErrorRequestHandler;

declare class ApplicationException extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string | undefined, statusCode: number | undefined, isOperational: boolean);
}

declare class NotFoundException extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string | undefined, statusCode?: number, isOperational?: boolean);
}

declare class StatusCodes {
    static BAD_REQUEST: number;
    static CONFLICT: number;
    static NOT_FOUND: number;
    static INTERNAL_SERVER_ERROR: number;
    static UNAUTHORIZED: number;
}

declare const morganMiddleware: (req: any, res: any, next: any) => void;

interface ILogger {
    debug(message: string): void;
    error(message: string): void;
    info(message: string): void;
}
declare class Logger implements ILogger {
    private logger;
    constructor();
    debug(message: string): void;
    info(message: string): void;
    error(message: string): void;
}
declare const loggerInstance: Logger;

declare const authMiddleware: (secret: string) => (req: Request, res: Response, next: NextFunction) => void;

export { ApplicationException, type ILogger, NotFoundException, StatusCodes, authMiddleware, errorHandler, loggerInstance, morganMiddleware };

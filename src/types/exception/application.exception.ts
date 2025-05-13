import { StatusCodes } from '../status-code/status-code';

export class ApplicationException extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    message: string | undefined,
    statusCode: number = StatusCodes.BAD_REQUEST,
    isOperational: boolean
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

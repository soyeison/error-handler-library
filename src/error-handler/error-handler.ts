import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ApplicationException } from '../types/exception/application.exception';
import { StatusCodes } from '../types/status-code/status-code';
import { NotFoundException } from '../types/exception/not-found.exception';
import { UnauthorizedException } from '../types/exception/unauthorized.exception';

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.errorMessage = err.message;
  if (err instanceof ApplicationException) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: err.message || 'Application error' });
  } else if (err instanceof NotFoundException) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: err.message || 'Not found Exception' });
  } else if (err instanceof UnauthorizedException) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: err.message || 'Token not valid' });
  } else {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error inesperado' });
  }
};

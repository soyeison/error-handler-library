import { Response } from 'express';
import morgan from 'morgan';
import { loggerInstance } from '../logging/logger';
morgan.token('message', (req, res: Response) => res.locals.errorMessage || '');

const getIpFormat = () => ':remote-addr - ';

const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

export const morganMiddleware = (req: any, res: any, next: any) => {
  const succesMorganLogger = morgan(successResponseFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: { write: (message) => loggerInstance.info(message.trim()) },
  });

  const errorMorganLogger = morgan(errorResponseFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: { write: (message) => loggerInstance.error(message.trim()) },
  });

  succesMorganLogger(req, res, (err) => {
    if (err) return next(err);
    errorMorganLogger(req, res, next);
  });
};

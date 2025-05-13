// src/types/status-code/status-code.ts
var StatusCodes = class {
};
StatusCodes.BAD_REQUEST = 400;
StatusCodes.CONFLICT = 409;
StatusCodes.NOT_FOUND = 404;
StatusCodes.INTERNAL_SERVER_ERROR = 500;
StatusCodes.UNAUTHORIZED = 401;

// src/types/exception/application.exception.ts
var ApplicationException = class extends Error {
  constructor(message, statusCode = StatusCodes.BAD_REQUEST, isOperational) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/types/exception/not-found.exception.ts
var NotFoundException = class extends Error {
  constructor(message, statusCode = StatusCodes.NOT_FOUND, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/types/exception/unauthorized.exception.ts
var UnauthorizedException = class extends Error {
  constructor(message, statusCode = StatusCodes.UNAUTHORIZED, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/error-handler/error-handler.ts
var errorHandler = (err, req, res, next) => {
  res.locals.errorMessage = err.message;
  if (err instanceof ApplicationException) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: err.message || "Application error" });
  } else if (err instanceof NotFoundException) {
    res.status(StatusCodes.NOT_FOUND).json({ message: err.message || "Not found Exception" });
  } else if (err instanceof UnauthorizedException) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: err.message || "Token not valid" });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error inesperado" });
  }
};

// src/morgan-middleware/morgan-middleware.ts
import morgan from "morgan";

// src/logging/logger.ts
import winston, { format } from "winston";
var Logger = class {
  constructor() {
    this.logger = winston.createLogger({
      level: "debug",
      format: format.combine(
        format.colorize(),
        format.errors({ stack: true }),
        format.timestamp(),
        format.align(),
        format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
      transports: [new winston.transports.Console()]
    });
  }
  debug(message) {
    this.logger.debug(message);
  }
  info(message) {
    this.logger.info(message);
  }
  error(message) {
    this.logger.error(message);
  }
};
var loggerInstance = new Logger();

// src/morgan-middleware/morgan-middleware.ts
morgan.token("message", (req, res) => res.locals.errorMessage || "");
var getIpFormat = () => ":remote-addr - ";
var successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
var errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;
var morganMiddleware = (req, res, next) => {
  const succesMorganLogger = morgan(successResponseFormat, {
    skip: (req2, res2) => res2.statusCode >= 400,
    stream: { write: (message) => loggerInstance.info(message.trim()) }
  });
  const errorMorganLogger = morgan(errorResponseFormat, {
    skip: (req2, res2) => res2.statusCode < 400,
    stream: { write: (message) => loggerInstance.error(message.trim()) }
  });
  succesMorganLogger(req, res, (err) => {
    if (err) return next(err);
    errorMorganLogger(req, res, next);
  });
};

// src/auth-middleware/auth-middleware.ts
import jwt from "jsonwebtoken";
var authMiddleware = (secret) => {
  return (req, res, next) => {
    const authHeader = req.headers.token;
    if (!authHeader) {
      throw new UnauthorizedException("Debe pasar un token valido");
    }
    try {
      const payload = jwt.verify(authHeader, secret);
      req.user = payload;
    } catch (error) {
      throw new UnauthorizedException("Token invalido");
    }
  };
};
export {
  ApplicationException,
  NotFoundException,
  StatusCodes,
  authMiddleware,
  errorHandler,
  loggerInstance,
  morganMiddleware
};

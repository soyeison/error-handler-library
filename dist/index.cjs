"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ApplicationException: () => ApplicationException,
  NotFoundException: () => NotFoundException,
  StatusCodes: () => StatusCodes,
  authMiddleware: () => authMiddleware,
  errorHandler: () => errorHandler,
  loggerInstance: () => loggerInstance,
  morganMiddleware: () => morganMiddleware
});
module.exports = __toCommonJS(index_exports);

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
var import_morgan = __toESM(require("morgan"), 1);

// src/logging/logger.ts
var import_winston = __toESM(require("winston"), 1);
var Logger = class {
  constructor() {
    this.logger = import_winston.default.createLogger({
      level: "debug",
      format: import_winston.format.combine(
        import_winston.format.colorize(),
        import_winston.format.errors({ stack: true }),
        import_winston.format.timestamp(),
        import_winston.format.align(),
        import_winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
      transports: [new import_winston.default.transports.Console()]
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
import_morgan.default.token("message", (req, res) => res.locals.errorMessage || "");
var getIpFormat = () => ":remote-addr - ";
var successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
var errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;
var morganMiddleware = (req, res, next) => {
  const succesMorganLogger = (0, import_morgan.default)(successResponseFormat, {
    skip: (req2, res2) => res2.statusCode >= 400,
    stream: { write: (message) => loggerInstance.info(message.trim()) }
  });
  const errorMorganLogger = (0, import_morgan.default)(errorResponseFormat, {
    skip: (req2, res2) => res2.statusCode < 400,
    stream: { write: (message) => loggerInstance.error(message.trim()) }
  });
  succesMorganLogger(req, res, (err) => {
    if (err) return next(err);
    errorMorganLogger(req, res, next);
  });
};

// src/auth-middleware/auth-middleware.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var authMiddleware = (secret) => {
  return (req, res, next) => {
    const authHeader = req.headers.token;
    if (!authHeader) {
      throw new UnauthorizedException("Debe pasar un token valido");
    }
    try {
      const payload = import_jsonwebtoken.default.verify(authHeader, secret);
      req.user = payload;
    } catch (error) {
      throw new UnauthorizedException("Token invalido");
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ApplicationException,
  NotFoundException,
  StatusCodes,
  authMiddleware,
  errorHandler,
  loggerInstance,
  morganMiddleware
});

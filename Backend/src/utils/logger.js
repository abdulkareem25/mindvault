import winston from 'winston';

const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Custom format to keep logs structured
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.simple()
);

const transports = [];
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({ filename: 'logs/combined.log', level }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  );
} else {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level
    })
  );
}

const mainLogger = winston.createLogger({
  level,
  format: logFormat,
  transports
});

// Create named child loggers
const extractionLogger = mainLogger.child({ service: 'extraction' });
const contextLogger = mainLogger.child({ service: 'context' });
const authLogger = mainLogger.child({ service: 'auth' });

// Mount named child loggers on the main logger object
mainLogger.extraction = extractionLogger;
mainLogger.context = contextLogger;
mainLogger.auth = authLogger;

export default mainLogger;

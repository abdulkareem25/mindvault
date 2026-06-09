import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error({ message: err.message, stack: err.stack, route: req.path });
  
  // Known error types
  if (err.name === 'ValidationError') return res.status(400).json({ status: 'error', message: err.message });
  if (err.name === 'CastError') return res.status(400).json({ status: 'error', message: 'Invalid ID format' });
  if (err.name === 'JsonWebTokenError') return res.status(401).json({ status: 'error', message: 'Invalid token' });
  if (err.name === 'TokenExpiredError') return res.status(401).json({ status: 'error', message: 'Token expired' });
  
  // Payload too large (from body-parser limits)
  if (err.status === 413 || err.statusCode === 413 || err.type === 'entity.too.large') {
    return res.status(413).json({ status: 'error', message: 'Payload too large' });
  }

  // Handled API/http errors (e.g. 401 Unauthorized from authMiddleware or 404 from routes)
  if (err.statusCode || err.status) {
    const statusCode = err.statusCode || err.status;
    return res.status(statusCode).json({ status: 'error', message: err.message });
  }
  
  // Unknown errors — never expose stack traces to client
  res.status(500).json({ status: 'error', message: 'Internal server error' });
};

export default errorHandler;

const errorMiddleware = (err, req, res, next) => {

  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let stack = err.stack;

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value";
  }

  if (process.env.NODE_ENV === "production") {
    res.status(statusCode).json({
      success: false,
      message,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack,
  });
};

export default errorMiddleware;
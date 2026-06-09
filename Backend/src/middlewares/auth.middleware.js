import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    let token, error;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      error = new Error("Unauthorized - No token provided");
      error.statusCode = 401;
      throw error;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        error = new Error("Unauthorized - User not found");
        error.statusCode = 401;
        throw error;
      }

      req.user = user;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        const expiredError = new Error("Unauthorized - Token expired");
        expiredError.statusCode = 401;
        return next(expiredError);
      }
      if (err.name === "JsonWebTokenError") {
        const invalidError = new Error("Unauthorized - Invalid token");
        invalidError.statusCode = 401;
        return next(invalidError);
      }
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
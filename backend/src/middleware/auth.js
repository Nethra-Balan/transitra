import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};

export const validationErrorHandler = (errors) => {
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => `${err.param}: ${err.msg}`);
    throw { status: 400, message: errorMessages.join(', ') };
  }
};

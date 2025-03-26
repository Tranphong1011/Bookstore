import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).send('Not authorized, no token');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send('Not authorized, token failed');
  }
}
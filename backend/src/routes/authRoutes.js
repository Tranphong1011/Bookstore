import express from 'express';
import { register, login, getAllUsers } from '../controller/authController.js';
import { hashPassword } from '../middleware/passwordMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/register', hashPassword, register);
router.post('/login', login);
router.get('/getAll', getAllUsers);

export default router;
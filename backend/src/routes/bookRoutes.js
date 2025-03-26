import express from 'express';
import { getAllBooks, createBook, deleteBook, getRecommendedBook } from '../controller/bookController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/create', authMiddleware, createBook);

router.get('/getAll', authMiddleware, getAllBooks);

router.get('/getRecommendedBook', authMiddleware, getRecommendedBook);

router.delete('/delete/:id', authMiddleware, deleteBook);
export default router;
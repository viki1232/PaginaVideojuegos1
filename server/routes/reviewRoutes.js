import express from 'express';
import {
    createReview,
    getReviewsByGameId,
    getAllReviews,
    deleteReview,
    editReview,
    likes,// ← Agregar import
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', createReview); // ← Agregar ruta para likes
router.get('/:gameId', getReviewsByGameId);
router.get('/', getAllReviews);
router.put('/:id', editReview);  // ← Agregar ruta PUT
router.delete('/:id', deleteReview);
router.put('/:id/likes', likes); // ← Agregar ruta para likes

export default router;
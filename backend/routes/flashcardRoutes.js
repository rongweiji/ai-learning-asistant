import express from 'express';

import {
    getFlashcards,
    getAllFlashcardSets,
    reviewFlashcards,
    toggleStarFlashcard,
    deleteFlashcardSet,
} from '../controllers/flashcardController.js';

import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllFlashcardSets);
router.get('/:documentId', getFlashcards);
router.post('/:cardId/review', reviewFlashcards);
router.post('/:cardId/star', toggleStarFlashcard);
router.delete('/:Id', deleteFlashcardSet);

export default router;
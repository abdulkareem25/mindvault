import express from 'express';
import { getLatestDigest, dismissDigest, getAllDigests } from '../controllers/digest.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Require auth for all digest actions
router.use(authMiddleware);

router.get('/latest', getLatestDigest);
router.patch('/:id/dismiss', dismissDigest);
router.get('/', getAllDigests);

export default router;

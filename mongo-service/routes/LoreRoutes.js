import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import * as getCtrl from '../controllers/getController.js';
import * as postCtrl from '../controllers/postController.js';

const router = express.Router();

// --- ROUTES GET ---
router.get('/creatures', getCtrl.getAllCreatures);
router.get('/testimonies', getCtrl.getAllTestimonies);

// --- ROUTES POST ---
router.post('/creatures', authenticate, postCtrl.createCreature);
router.post('/testimonies', authenticate, postCtrl.createTestimony);
router.post('/testimonies/:id/validate', authenticate, postCtrl.validateTestimony);

export default router;
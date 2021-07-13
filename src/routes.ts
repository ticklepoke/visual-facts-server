import express from 'express';
import { factsController } from './controllers';

const router = express.Router();

router.get('/facts', factsController.getFacts);

export default router;

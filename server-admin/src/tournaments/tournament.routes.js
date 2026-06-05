import { Router } from 'express';
import {
  createTournament,
  getTournamentById,
  getTournaments,
} from './tournament.controller.js';

const router = Router();

router.get('/', getTournaments);
router.get('/:id', getTournamentById);
router.post('/', createTournament);

export default router;

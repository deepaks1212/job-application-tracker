import { Router } from 'express';
import { ApplicationController } from '../controllers/applicationController';

const router = Router();

// Stats route should be before :id route to avoid conflict
router.get('/stats', ApplicationController.getStats);

router.get('/', ApplicationController.getAll);
router.get('/:id', ApplicationController.getById);
router.post('/', ApplicationController.create);
router.patch('/:id', ApplicationController.update);
router.delete('/:id', ApplicationController.delete);

export default router;

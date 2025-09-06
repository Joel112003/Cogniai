import { Signup, Login, getUsers } from '../controllers/auth.controller.js';
import { Router } from 'express';

const router = Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.get('/users', getUsers); // Added this route

export default router;
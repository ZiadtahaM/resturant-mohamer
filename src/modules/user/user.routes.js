import express from 'express';
const router = express.Router();
import validate from '../middlewares/validate.js';
import auth from '../middlewares/auth.js';
import role from '../middlewares/role.js';
import { login, register, getAllUsers } from './user.controller.js';

import { registerSchema, loginSchema } from './user.schema.js';
router.post('/register',validate(registerSchema), register);
router.post('/login',validate(loginSchema),login);

// ADMIN ONLY
router.get('/users', auth, role('ADMIN'), getAllUsers);

export default router;
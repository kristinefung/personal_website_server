import express from 'express';
import { UserController } from '../controllers/user.controller';

const userController = new UserController();

const router = express.Router();

/*************************************************************
 *                        User Module
 ************************************************************/
router.post('/users', (req, res) => userController.createUser(req, res));
router.get('/users/:id', (req, res) => userController.getUserById(req, res));
router.get('/users', (req, res) => userController.getAllUsers(req, res));
router.delete('/users/:id', (req, res) => userController.deleteUserById(req, res));

export { router };
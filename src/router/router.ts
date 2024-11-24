import express from 'express';
import { IoCContainer } from '../ioc/ioc_container';

const iocContainer = new IoCContainer();
const userCtlr = iocContainer.getUserController();

const router = express.Router();

/*************************************************************
 *                        User Module
 ************************************************************/
router.post('/users', (req, res) => userCtlr.createUser(req, res));
router.get('/users/:id', (req, res) => userCtlr.getUserById(req, res));
router.get('/users', (req, res) => userCtlr.getAllUsers(req, res));
router.delete('/users/:id', (req, res) => userCtlr.deleteUserById(req, res));
router.put('/users/:id', (req, res) => userCtlr.updateUserById(req, res));
router.post('/login', (req, res) => userCtlr.login(req, res));

export { router };
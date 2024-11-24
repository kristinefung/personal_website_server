import express from 'express';
import { PrismaClient } from '@prisma/client';
import { UserController } from '../controllers/user.controller';

import { UserSessionTokenRepository } from '../repositories/user_session_token.repository';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { TokenService } from '../services/token.service';

const prismaClient = new PrismaClient();

const ustRepo = new UserSessionTokenRepository(prismaClient);
const userRepo = new UserRepository(prismaClient);

const tokenServ = new TokenService(ustRepo);
const userServ = new UserService(userRepo, tokenServ);

const userCtlr = new UserController(userServ);

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
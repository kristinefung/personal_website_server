import { PrismaClient } from '@prisma/client';
import { UserSessionTokenRepository } from '../repositories/user_session_token.repository';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { UserController } from '../controllers/user.controller';

import dotenv from 'dotenv';

export class IoCContainer {
    private prismaClient: PrismaClient;
    private ustRepo: UserSessionTokenRepository;
    private userRepo: UserRepository;
    private authServ: AuthService;
    private userServ: UserService;
    private userCtlr: UserController;

    constructor() {

        // Validate environment variables
        dotenv.config();
        this._validateEnvVariables();

        // Prisma Client
        this.prismaClient = new PrismaClient();

        // Repositories
        this.ustRepo = new UserSessionTokenRepository(this.prismaClient);
        this.userRepo = new UserRepository(this.prismaClient);

        // Services
        this.authServ = new AuthService(this.ustRepo);
        this.userServ = new UserService(this.userRepo, this.authServ);

        // Controllers
        this.userCtlr = new UserController(this.userServ);
    }

    public getUserController(): UserController {
        return this.userCtlr;
    }

    private _validateEnvVariables(): void {
        const requiredEnvVars = [
            'DATABASE_URL',
            'PORT',
            'JWT_SECRET_KEY'
        ];

        requiredEnvVars.forEach((varName) => {
            if (!process.env[varName]) {
                throw new Error(`Environment variable ${varName} is not set`);
            }
        });
    }
}
import { PrismaClient } from '@prisma/client';

import { UserSessionTokenRepository } from '../repositories/user_session_token.repository';
import { UserRepository } from '../repositories/user.repository';
import { EnquiryRepository } from '../repositories/enquiry.repository';
import { EducationRepository } from '../repositories/education.repository';

import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { EnquiryService } from '../services/enquiry.service';
import { EducationService } from '../services/education.service';

import { UserController } from '../controllers/user.controller';
import { EnquiryController } from '../controllers/enquiry.controller';
import { EducationController } from '../controllers/education.controller';

import dotenv from 'dotenv';

export class IoCContainer {
    private prismaClient: PrismaClient;

    private ustRepo: UserSessionTokenRepository;
    private userRepo: UserRepository;
    private enquiryRepo: EnquiryRepository;
    private educationRepo: EducationRepository;

    private authServ: AuthService;
    private userServ: UserService;
    private enquiryServ: EnquiryService;
    private educationServ: EducationService;

    private userCtlr: UserController;
    private enquiryCtlr: EnquiryController;
    private educationCtlr: EducationController;

    constructor() {

        // Validate environment variables
        dotenv.config();
        this._validateEnvVariables();

        // Prisma Client
        this.prismaClient = new PrismaClient();

        // Repositories
        this.ustRepo = new UserSessionTokenRepository(this.prismaClient);
        this.userRepo = new UserRepository(this.prismaClient);
        this.enquiryRepo = new EnquiryRepository(this.prismaClient);
        this.educationRepo = new EducationRepository(this.prismaClient);

        // Services
        this.authServ = new AuthService(this.ustRepo, this.userRepo);
        this.userServ = new UserService(this.userRepo, this.authServ);
        this.enquiryServ = new EnquiryService(this.enquiryRepo);
        this.educationServ = new EducationService(this.educationRepo);

        // Controllers
        this.userCtlr = new UserController(this.userServ, this.authServ);
        this.enquiryCtlr = new EnquiryController(this.enquiryServ, this.authServ);
        this.educationCtlr = new EducationController(this.educationServ, this.authServ);
    }

    public getUserController(): UserController {
        return this.userCtlr;
    }

    public getEnquiryController(): EnquiryController {
        return this.enquiryCtlr;
    }

    public getEducationController(): EducationController {
        return this.educationCtlr;
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
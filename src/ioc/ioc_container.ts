import { PrismaClient } from '@prisma/client';

import { UserLoginLogRepository } from 'src/repositories/user_login_log.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { EnquiryRepository } from 'src/repositories/enquiry.repository';
import { EducationRepository } from 'src/repositories/education.repository';
import { WorkRepository } from 'src/repositories/work.repository';

import { UserService } from 'src/services/user.service';
import { AuthService } from 'src/services/auth.service';
import { EnquiryService } from 'src/services/enquiry.service';
import { EducationService } from 'src/services/education.service';
import { WorkService } from 'src/services/work.service';

import { UserController } from 'src/controllers/user.controller';
import { EnquiryController } from 'src/controllers/enquiry.controller';
import { EducationController } from 'src/controllers/education.controller';
import { WorkController } from 'src/controllers/work.controller';

import dotenv from 'dotenv';

export class IoCContainer {
    private prismaClient: PrismaClient;

    private ullRepo: UserLoginLogRepository;
    private userRepo: UserRepository;
    private enquiryRepo: EnquiryRepository;
    private educationRepo: EducationRepository;
    private workRepo: WorkRepository;

    private authServ: AuthService;
    private userServ: UserService;
    private enquiryServ: EnquiryService;
    private educationServ: EducationService;
    private workServ: WorkService;

    private userCtlr: UserController;
    private enquiryCtlr: EnquiryController;
    private educationCtlr: EducationController;
    private workCtlr: WorkController;

    constructor() {

        // Validate environment variables
        dotenv.config();
        this._validateEnvVariables();

        // Prisma Client
        this.prismaClient = new PrismaClient();

        // Repositories
        this.ullRepo = new UserLoginLogRepository(this.prismaClient);
        this.userRepo = new UserRepository(this.prismaClient);
        this.enquiryRepo = new EnquiryRepository(this.prismaClient);
        this.educationRepo = new EducationRepository(this.prismaClient);
        this.workRepo = new WorkRepository(this.prismaClient);

        // Services
        this.authServ = new AuthService(this.ullRepo, this.userRepo);
        this.userServ = new UserService(this.userRepo, this.authServ, this.ullRepo);
        this.enquiryServ = new EnquiryService(this.enquiryRepo);
        this.educationServ = new EducationService(this.educationRepo);
        this.workServ = new WorkService(this.workRepo);

        // Controllers
        this.userCtlr = new UserController(this.userServ, this.authServ);
        this.enquiryCtlr = new EnquiryController(this.enquiryServ, this.authServ);
        this.educationCtlr = new EducationController(this.educationServ, this.authServ);
        this.workCtlr = new WorkController(this.workServ, this.authServ);
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

    public getWorkController(): WorkController {
        return this.workCtlr;
    }

    // TODO: Seems not easy to manage #refactor
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
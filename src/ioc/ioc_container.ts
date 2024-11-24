import { PrismaClient } from '@prisma/client';
import { UserSessionTokenRepository } from '../repositories/user_session_token.repository';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { TokenService } from '../services/token.service';
import { UserController } from '../controllers/user.controller';

export class IoCContainer {
    private prismaClient: PrismaClient;
    private ustRepo: UserSessionTokenRepository;
    private userRepo: UserRepository;
    private tokenServ: TokenService;
    private userServ: UserService;
    private userCtlr: UserController;

    constructor() {
        // Prisma Client
        this.prismaClient = new PrismaClient();

        // Repositories
        this.ustRepo = new UserSessionTokenRepository(this.prismaClient);
        this.userRepo = new UserRepository(this.prismaClient);

        // Services
        this.tokenServ = new TokenService(this.ustRepo);
        this.userServ = new UserService(this.userRepo, this.tokenServ);

        // Controllers
        this.userCtlr = new UserController(this.userServ);
    }

    public getUserController(): UserController {
        return this.userCtlr;
    }
}
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    findUserByEmail(email: string): Promise<{
        id: number;
        email: string;
        password: string;
    } | null>;
    register(email: string, password: string): Promise<{
        message: string;
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        message: string;
        token: string;
    }>;
}

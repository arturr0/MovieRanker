import { AuthService } from './auth.service';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    login(body: {
        email: string;
        password: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
}

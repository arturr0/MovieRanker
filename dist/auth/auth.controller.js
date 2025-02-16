"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(body, res) {
        try {
            const existingUser = await this.authService.findUserByEmail(body.email);
            if (existingUser) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    error: 'Account already exists',
                });
            }
            const result = await this.authService.register(body.email, body.password);
            if (result.token) {
                return res.status(common_1.HttpStatus.CREATED).json({
                    message: 'User registered successfully',
                    token: result.token,
                });
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    message: 'User registration failed',
                });
            }
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async login(body, res) {
        try {
            console.log('Login attempt:', body.email);
            const result = await this.authService.login(body.email, body.password);
            if (!result.token) {
                console.log('Login failed: No token');
                return res.status(common_1.HttpStatus.UNAUTHORIZED).json({ error: 'Invalid credentials' });
            }
            console.log('Login successful:', result.token);
            return res.status(common_1.HttpStatus.OK).json({
                message: result.message,
                token: result.token,
            });
        }
        catch (error) {
            console.error('Login error:', error);
            return res.status(common_1.HttpStatus.UNAUTHORIZED).json({ error: error.message });
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map
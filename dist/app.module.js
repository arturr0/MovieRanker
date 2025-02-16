"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const prisma_service_1 = require("./prisma/prisma.service");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const database_module_1 = require("./database/database.module");
const config_1 = require("@nestjs/config");
const movies_module_1 = require("./movies/movies.module");
const movies_service_1 = require("./movies/movies.service");
const jwt_1 = require("@nestjs/jwt");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const jwt_2 = require("@nestjs/jwt");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET_KEY,
                signOptions: { expiresIn: '1h' },
            }),
            auth_module_1.AuthModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'frontend'),
            }),
            database_module_1.DatabaseModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            movies_module_1.MoviesModule,
        ],
        controllers: [],
        providers: [prisma_service_1.PrismaService, jwt_auth_guard_1.JwtAuthGuard, jwt_2.JwtService, movies_service_1.MoviesService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
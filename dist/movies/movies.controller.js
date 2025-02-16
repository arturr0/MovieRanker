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
exports.MoviesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const path_1 = require("path");
const prisma_service_1 = require("../prisma/prisma.service");
const movies_service_1 = require("./movies.service");
const operators_1 = require("rxjs/operators");
let MoviesController = class MoviesController {
    constructor(httpService, prisma, moviesService) {
        this.httpService = httpService;
        this.prisma = prisma;
        this.moviesService = moviesService;
    }
    async getMoviesPage(res) {
        const filePath = (0, path_1.join)(__dirname, '..', '..', 'frontend', 'movies.html');
        console.log('Serving file:', filePath);
        return res.sendFile(filePath);
    }
    findAll(req, res) {
        console.log('User:', req.user);
        return res.json({
            message: 'This is a protected movies route',
            user: req.user,
        });
    }
    async searchMovies(query, type, id, res) {
        const apiKey = process.env.TMDB_API_KEY;
        let searchUrl = '';
        console.log('search');
        switch (type) {
            case 'actor':
            case 'director':
                searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
                break;
            default:
                searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
        }
        try {
            const searchResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(searchUrl));
            const results = searchResponse.data.results;
            if (!results || results.length === 0) {
                return res.json({ error: `No results found for ${type}: ${query}` });
            }
            if (type === 'title') {
                const movies = await Promise.all(results.map(async (movie) => {
                    const ratings = await this.prisma.ratingMovie.findMany({
                        where: { tmdbId: movie.id },
                        orderBy: { id: 'asc' },
                        select: {
                            id: true,
                            rating: true,
                            userId: true,
                            userEmail: true,
                            comment: true,
                        },
                    });
                    return {
                        title: movie.title,
                        year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
                        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '',
                        id: movie.id,
                        ratings,
                    };
                }));
                return res.json({ movies, queryType: type, queryText: query, querySenderID: id });
            }
            else {
                const people = await Promise.all(results.map(async (person) => {
                    const ratings = await this.prisma.ratingPerson.findMany({
                        where: { tmdbId: person.id },
                        orderBy: { id: 'asc' },
                        select: {
                            id: true,
                            rating: true,
                            userId: true,
                            userEmail: true,
                            comment: true,
                        },
                    });
                    return {
                        name: person.name,
                        profile: person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : '',
                        id: person.id,
                        ratings,
                    };
                }));
                return res.json({ people, queryType: type, queryText: query, querySenderID: id });
            }
        }
        catch (error) {
            console.error('Error fetching movies:', error);
            return res.json({ error: 'Failed to fetch movies', details: error.message });
        }
    }
    async rateItem(req, body, res) {
        const { type, id, title, rating, post, queryType, queryText, querySenderID, userName } = body;
        console.log(body);
        try {
            let ratingRecord;
            if (type === 'movie') {
                await this.prisma.movie.upsert({
                    where: { id },
                    update: {},
                    create: { id, title, releaseDate: 'N/A', rating: null, posterPath: '' },
                });
                ratingRecord = await this.prisma.ratingMovie.upsert({
                    where: { userEmail_tmdbId: { userEmail: userName, tmdbId: id } },
                    update: { rating, comment: post },
                    create: { userId: querySenderID, userEmail: userName, tmdbId: id, title, rating, comment: post },
                });
            }
            else if (type === 'person') {
                await this.prisma.person.upsert({
                    where: { id },
                    update: {},
                    create: { id, name: title, biography: '', profilePath: '' },
                });
                ratingRecord = await this.prisma.ratingPerson.upsert({
                    where: { userEmail_tmdbId: { userEmail: userName, tmdbId: id } },
                    update: { rating, comment: post },
                    create: { userId: querySenderID, userEmail: userName, tmdbId: id, title, rating, comment: post },
                });
            }
            else {
                return res.json({ success: false, error: 'Invalid type specified' });
            }
            this.moviesService.notifyUpdate(queryType, queryText, querySenderID);
            return res.json({ success: true, ratingRecord });
        }
        catch (error) {
            console.error('Error saving rating:', error);
            return res.json({ success: false, error: error.message });
        }
    }
    sendUpdates() {
        console.log('SSE connection established');
        return this.moviesService.getUpdates().pipe((0, operators_1.map)((event) => ({
            data: event,
        })));
    }
};
exports.MoviesController = MoviesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "getMoviesPage", null);
__decorate([
    (0, common_1.Get)('protected'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MoviesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('id')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Object]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "searchMovies", null);
__decorate([
    (0, common_1.Post)('rate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "rateItem", null);
__decorate([
    (0, common_1.Get)('updates'),
    (0, common_1.Sse)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MoviesController.prototype, "sendUpdates", null);
exports.MoviesController = MoviesController = __decorate([
    (0, common_1.Controller)('movies'),
    __metadata("design:paramtypes", [axios_1.HttpService,
        prisma_service_1.PrismaService,
        movies_service_1.MoviesService])
], MoviesController);
//# sourceMappingURL=movies.controller.js.map
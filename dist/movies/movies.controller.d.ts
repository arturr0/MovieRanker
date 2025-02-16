import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { MoviesService } from './movies.service';
import { RequestWithUser } from '../auth/request-with-user';
export declare class MoviesController {
    private readonly httpService;
    private readonly prisma;
    private readonly moviesService;
    constructor(httpService: HttpService, prisma: PrismaService, moviesService: MoviesService);
    getMoviesPage(res: Response): Promise<void>;
    findAll(req: RequestWithUser, res: Response): Response<any, Record<string, any>>;
    searchMovies(query: string, type: string, id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    rateItem(req: RequestWithUser, body: {
        type: string;
        id: number;
        title: string;
        rating: number;
        post: string;
        queryType: string;
        queryText: string;
        querySenderID: number;
        userName: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    sendUpdates(): import("rxjs").Observable<{
        data: any;
    }>;
}

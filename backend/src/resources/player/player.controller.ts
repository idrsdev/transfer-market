import { Router, Request, Response } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import validationMiddleware from '@/middleware/validation.middleware';
import PlayerService from '@/resources/player/player.service';
import validate from '@/resources/player/player.validation';
import catchAsync from '@/utils/catchAsync';
import authenticatedMiddleware from '@/middleware/authentication.middleware';

class PlayerController implements Controller {
    public path = '/players';
    public router = Router();
    private playerService = new PlayerService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(`${this.path}`, this.getPlayers);
        this.router.post(
            `${this.path}/:id/list`,
            catchAsync(authenticatedMiddleware),
            catchAsync(validationMiddleware(validate.list)),
            this.listPlayer
        );
        this.router.post(
            `${this.path}/:id/unlist`,
            catchAsync(authenticatedMiddleware),
            this.unlistPlayer
        );
        this.router.post(
            `${this.path}/:id/buy`,
            catchAsync(authenticatedMiddleware),
            this.buyPlayer
        );
    }

    private getPlayers = catchAsync(
        async (req: Request, res: Response): Promise<Response | void> => {
            const {
                page = 1,
                pageSize = 8,
                search,
                team,
                min_price,
                max_price,
                position,
                is_listed,
            } = req.query;

            const players = await this.playerService.getPlayers(
                Number(page),
                Number(pageSize),
                search as string,
                team as string,
                Number(min_price),
                Number(max_price),
                position as string,
                is_listed == undefined ? true : is_listed === 'true' // Convert to boolean
            );
            res.status(200).json({ players });
        }
    );

    private listPlayer = catchAsync(
        async (req: Request, res: Response): Promise<Response | void> => {
            const { id } = req.params;
            const { listing_price } = req.body as { listing_price: string };
            const player = await this.playerService.listPlayer(
                id,
                +listing_price
            );
            res.status(200).json(player);
        }
    );

    private unlistPlayer = catchAsync(
        async (req: Request, res: Response): Promise<Response | void> => {
            const { id } = req.params;
            console.log({ id });

            const player = await this.playerService.unlistPlayer(id);
            res.status(200).json(player);
        }
    );

    private buyPlayer = catchAsync(
        async (req: Request, res: Response): Promise<Response | void> => {
            const { id } = req.params;
            const userId = req.user?._id!;
            const result = await this.playerService.buyPlayer(id, userId);
            res.status(200).json(result);
        }
    );
}

export default PlayerController;

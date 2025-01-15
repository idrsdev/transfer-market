import { Router, Request, Response } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/team/team.validation';
import TeamService from '@/resources/team/team.service';
import catchAsync from '@/utils/catchAsync';
import authenticatedMiddleware from '@/middleware/authentication.middleware';
import HttpException from '@/utils/exceptions/http.exception';

class TeamController implements Controller {
    public path = '/teams';
    public router = Router();
    private TeamService = new TeamService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}`,
            catchAsync(authenticatedMiddleware),
            catchAsync(validationMiddleware(validate.create)),
            catchAsync(this.create)
        );
        this.router.get(`${this.path}`, this.getTeams);
        this.router.get(
            `${this.path}/me/players`,
            catchAsync(authenticatedMiddleware),
            this.getPlayersByTeam
        );
    }

    private create = async (
        req: Request,
        res: Response
    ): Promise<Response | void> => {
        const { name, players } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            throw new HttpException(400, 'No Team Found');
        }

        const result = await this.TeamService.create(name, players, userId);
        res.status(201).json(result);
    };

    private getTeams = catchAsync(
        async (req: Request, res: Response): Promise<Response | void> => {
            const { search, limit } = req.query;
            const teams = await this.TeamService.getTeams(
                search as string,
                Number(limit)
            );
            res.status(200).json({ teams });
        }
    );

    private getPlayersByTeam = catchAsync(
        async (req: Request, res: Response): Promise<Response | void> => {
            const teamId = req.user?.team_id;

            if (!teamId) {
                throw new HttpException(400, 'No Team Found');
            }

            const players = await this.TeamService.getPlayersByTeam(teamId);
            res.status(200).json(players);
        }
    );
}

export default TeamController;

import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';
import catchAsync from '@/utils/catchAsync';
import authenticatedMiddleware from '@/middleware/authentication.middleware';

class UserController implements Controller {
    public path = '/users' as const;
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initialRoutes();
    }

    private initialRoutes(): void {
        this.router.post(
            `${this.path}/login-or-signup`,
            catchAsync(validationMiddleware(validate.loginOrSignup)),
            catchAsync(this.loginOrSignup)
        );
        this.router.get(
            `${this.path}/me`,
            catchAsync(authenticatedMiddleware),
            catchAsync(this.getCurrentUser)
        );
    }

    private loginOrSignup = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body as {
                email: string;
                password: string;
            };

            const result = await this.UserService.loginOrSignup(
                email,
                password
            );
            res.status(200).json(result);
        } catch (error: unknown) {
            next(new HttpException(400, (error as Error).message));
        }
    };

    private getCurrentUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const user = req.user;
            if (!user) {
                throw new Error('User not found');
            }
            res.status(200).json({ user });
        } catch (error: unknown) {
            next(new HttpException(400, (error as Error).message));
        }
    };
}

export default UserController;

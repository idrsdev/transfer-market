import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/token';
import userModel from '@/resources/user/user.model';
import Token from '@/utils/interfaces/token.interface';
import HttpException from '@/utils/exceptions/http.exception';
import jwt from 'jsonwebtoken';

async function authenticatedMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        next(new HttpException(401, 'Unauthorized'));
        return;
    }

    const accessToken = bearer?.split('Bearer ')[1].trim();

    try {
        const payload: Token | jwt.VerifyErrors = await verifyToken(
            accessToken
        );

        if (payload instanceof jwt.JsonWebTokenError) {
            return;
        }
        const user = await userModel.findById(payload.id).select('-password');

        if (!user) {
            next(new HttpException(401, 'Unauthorized'));
            return;
        }
        req.user = user;

        next();
    } catch (error) {
        console.log('error', error);

        if (error instanceof jwt.TokenExpiredError) {
            next(new HttpException(401, 'Unauthorized, Login again'));
        }

        if (error instanceof jwt.JsonWebTokenError) {
            next(new HttpException(401, 'Invalid session token'));
        }
        next(new HttpException(401, 'Unauthorized'));
    }
}

export default authenticatedMiddleware;

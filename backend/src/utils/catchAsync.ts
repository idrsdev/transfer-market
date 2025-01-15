import { Request, Response, NextFunction } from 'express';

type fnType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<unknown>;

const catchAsync =
    (fn: fnType) => (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next && next(err));
    };

export default catchAsync;

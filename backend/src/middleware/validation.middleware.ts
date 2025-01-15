import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

function validationMiddleware(
    schema: Joi.Schema
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };

        // schema
        //     .validateAsync(req.body, validationOptions)
        //     .then((value) => {
        //         req.body = value as Record<string, unknown>;
        //         next();
        //     })
        //     .catch((err: unknown) => {
        //         const errors: string[] = [];
        //         (err as Joi.ValidationError).details.forEach(
        //             (error: Joi.ValidationErrorItem) => {
        //                 errors.push(error.message);
        //             }
        //         );
        //         res.status(400).send({ errors });
        //     });

        try {
            const value = (await schema.validateAsync(
                req.body,
                validationOptions
            )) as Record<string, unknown>;
            req.body = value;
            next();
        } catch (err: unknown) {
            const errors: string[] = [];
            (err as Joi.ValidationError).details.forEach(
                (error: Joi.ValidationErrorItem) => {
                    errors.push(error.message);
                }
            );
            res.status(400).send({ errors });
        }
    };
}

export default validationMiddleware;

import jwt from 'jsonwebtoken';
import { IUser } from '@/resources/user/user.interface';
import Token from '@/utils/interfaces/token.interface';
import { HydratedDocument } from 'mongoose';

export const createToken = (user: HydratedDocument<IUser>): string => {
    return jwt.sign(
        { id: user._id.toString() },
        process.env.JWT_SECRET ? process.env.JWT_SECRET : '',
        {
            expiresIn: '3d',
        }
    );
};

export const verifyToken = async (
    token: string
): Promise<jwt.VerifyErrors | Token> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            process.env.JWT_SECRET as jwt.Secret,
            (err, payload) => {
                if (err) return reject(err);
                resolve(payload as Token);
            }
        );
    });
};

export default { createToken, verifyToken };

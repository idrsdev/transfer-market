import { Document, Model, ObjectId } from 'mongoose';

interface IUser {
    _id: string;
    email: string;
    password?: string;
    has_completed_setup: boolean;
    team_id: ObjectId | null;
    balance: number;
}

// Put all user instance methods in this interface:
interface IUserMethods {
    isValidPassword(password: string): Promise<Error | boolean>;
}

// Create a new Model type that knows about IUserMethods...
// Model<IUser, {}, IUserMethods>
// type UserModel = ;

interface UserModel
    extends Model<IUser, Record<string, unknown>, IUserMethods> {
    myStaticMethod(): number;
}

interface IUserLogin {
    email: string;
    password: string;
}

type IUserDoc = IUser & Document;

export { IUser, IUserDoc, UserModel, IUserLogin, IUserMethods };

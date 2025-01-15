import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import {
    IUser,
    UserModel,
    IUserMethods,
} from '@/resources/user/user.interface';

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        has_completed_setup: {
            type: Boolean,
            default: false,
        },
        team_id: {
            type: Schema.Types.ObjectId,
            ref: 'Team',
            default: null,
        },
        balance: {
            type: Number,
            default: 5000000, // 5M default balance
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified) {
        return next();
    }

    const hash = await bcrypt.hash(this.password || '', 10);
    this.password = hash;
    next();
});

UserSchema.methods.isValidPassword = async function (
    this: IUser,
    password: string
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password || '');
};

export default model<IUser, UserModel>('User', UserSchema);

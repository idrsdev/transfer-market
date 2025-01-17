import { Schema, model } from 'mongoose';
import {
    ITeam,
    TeamModel,
    ITeamMethods,
} from '@/resources/team/team.interface';

const TeamSchema = new Schema<ITeam, TeamModel, ITeamMethods>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret.__v;
                return ret;
            },
        },
        toObject: {
            virtuals: true,
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

export default model<ITeam, TeamModel>('Team', TeamSchema);

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
    }
);

export default model<ITeam, TeamModel>('Team', TeamSchema);

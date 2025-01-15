import { Document, Model } from 'mongoose';

interface ITeam {
    name: string;
    created_at: Date;
}

interface ITeamMethods {
    // Add any team-specific methods here
}

interface TeamModel
    extends Model<ITeam, Record<string, unknown>, ITeamMethods> {
    // Add any static methods here
}

type ITeamDoc = ITeam & Document;

export { ITeam, ITeamDoc, TeamModel, ITeamMethods };

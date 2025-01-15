import { Document, Model, ObjectId } from 'mongoose';

interface IPlayer {
    name: string;
    team_id: ObjectId;
    position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
    base_price: number;
    is_listed: boolean;
    listing_price: number | null;
}

interface IPlayerMethods {
    // Add any player-specific methods here
}

interface PlayerModel
    extends Model<IPlayer, Record<string, unknown>, IPlayerMethods> {
    // Add any static methods here
}

type IPlayerDoc = IPlayer & Document;

export { IPlayer, IPlayerDoc, PlayerModel, IPlayerMethods };

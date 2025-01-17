import { Schema, model } from 'mongoose';
import {
    IPlayer,
    PlayerModel,
    IPlayerMethods,
} from '@/resources/player/player.interface';

const PlayerSchema = new Schema<IPlayer, PlayerModel, IPlayerMethods>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        team_id: {
            type: Schema.Types.ObjectId,
            ref: 'Team',
            required: true,
        },
        position: {
            type: String,
            enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
            required: true,
        },
        base_price: {
            type: Number,
            required: true,
        },
        is_listed: {
            type: Boolean,
            default: false,
        },
        listing_price: {
            type: Number,
            default: null,
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

export default model<IPlayer, PlayerModel>('Player', PlayerSchema);

import { Schema, model } from 'mongoose';
import {
    ITransfer,
    TransferModel,
    ITransferMethods,
} from '@/resources/transfer/transfer.interface';

const TransferSchema = new Schema<ITransfer, TransferModel, ITransferMethods>(
    {
        player_id: {
            type: Schema.Types.ObjectId,
            ref: 'Player',
            required: true,
        },
        from_team_id: {
            type: Schema.Types.ObjectId,
            ref: 'Team',
            required: true,
        },
        to_team_id: {
            type: Schema.Types.ObjectId,
            ref: 'Team',
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export default model<ITransfer, TransferModel>('Transfer', TransferSchema);

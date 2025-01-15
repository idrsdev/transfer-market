import { Document, Model, ObjectId } from 'mongoose';

interface ITransfer {
    player_id: ObjectId;
    from_team_id: ObjectId;
    to_team_id: ObjectId;
    price: number;
    created_at: Date;
}

interface ITransferMethods {
    // Add any transfer-specific methods here
}

interface TransferModel
    extends Model<ITransfer, Record<string, unknown>, ITransferMethods> {
    // Add any static methods here
}

type ITransferDoc = ITransfer & Document;

export { ITransfer, ITransferDoc, TransferModel, ITransferMethods };

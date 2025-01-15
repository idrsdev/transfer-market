import { Schema } from 'mongoose';

interface Token {
    id: Schema.Types.ObjectId;
    expireIn: number;
}
export default Token;

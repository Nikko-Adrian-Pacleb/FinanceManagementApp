import { InferSchemaType, Schema, model } from "mongoose";

const walletSchema = new Schema(
    {
        WalletAccount: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        WalletName: {
            type: String,
            required: true,
            trim: true,
        },
        WalletDescription: {
            type: String,
            trim: true,
        },
        WalletBalance: {
            type: Number,
            required: true,
            get: (v: number) => (v / 100).toFixed(2),
            set: (v: number) => v * 100,
        },
    }
)

type WalletDocument = InferSchemaType<typeof walletSchema>;

export default model<WalletDocument>("Wallet", walletSchema);
import { InferSchemaType, Schema, model } from "mongoose";

const accountSchema = new Schema(
  {
    AccountId: {
      type: String,
      required: true,
      trim: true,
    },
    AccountPin: {
      type: String,
      required: true,
      trim: true,
    },
    AccountWallets: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

type Account = InferSchemaType<typeof accountSchema>;

export default model<Account>("Account", accountSchema);

import { InferSchemaType, Schema, model } from "mongoose";

const transactionTagSchema = new Schema(
  {
    TransactionTagAccount: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Account",
    },
    TransactionTagName: {
      type: String,
      required: true,
      unique: true,
    },
    TransactionTagColor: {
      type: String,
      required: true,
      default: "#D9B70D",
    },
  },
  {
    timestamps: true,
  }
);

type TransactionTag = InferSchemaType<typeof transactionTagSchema>;

export default model<TransactionTag>("TransactionTag", transactionTagSchema);

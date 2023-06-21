import { InferSchemaType, Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    // Transaction Account Details
    TransactionAccount: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Account",
    },
    TransactionWallet: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Wallet",
    },

    // Transaction Details
    TransactionTitle: {
      type: String,
      required: true,
      trim: true,
    },
    TransactionDescription: {
      type: String,
      trim: true,
    },
    TransactionType: {
      type: String,
      required: true,
      enum: ["Income", "Expense"],
    },
    TransactionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    TransactionAmount: {
      type: Number,
      required: true,
      get: (v: number) => (v / 100).toFixed(2),
      set: (v: number) => v * 100,
    },
    TransactionTags: [
      {
        type: Schema.Types.ObjectId,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

type Transaction = InferSchemaType<typeof transactionSchema>;

export default model<Transaction>("Transaction", transactionSchema);

import { InferSchemaType, Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    TransactionType: {
      type: String,
      required: true,
      enum: ["Income", "Expense"],
    },
    TransactionDate: {
      type: Date,
      required: true,
    },
    TransactionAmount: {
      type: Number,
      required: true,
    },
    TransactionTag: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

type Transaction = InferSchemaType<typeof transactionSchema>;

export default model<Transaction>("Transaction", transactionSchema);

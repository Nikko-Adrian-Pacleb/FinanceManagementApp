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
      default: Date.now,
    },
    TransactionAmount: {
      type: Number,
      required: true,
      get: (v: number) => (v / 100).toFixed(2),
      set: (v: number) => v * 100,
    },
    TransactionTag: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

type Transaction = InferSchemaType<typeof transactionSchema>;

export default model<Transaction>("Transaction", transactionSchema);

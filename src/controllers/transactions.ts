import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Transaction from "../models/transactions";

/**
 * @route GET /transactions
 * @description Get all transactions
 * @access Private !!!Not Implemented!!!
 */
export const getTransactions: RequestHandler = async (req, res, next) => {
  try {
    const transaxtions = await Transaction.find()
      .sort({ TransactionDate: -1 })
      .limit(10);
    res.status(200).json(transaxtions);
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /transactions
 * @description Add a new transaction
 * @access Private !!!Not Implemented!!!
 */
interface CreateTransactionBody {
  TransactionType: string;
  TransactionDate: Date;
  TransactionAmount: number;
  TransactionTag?: string;
}
export const createTransaction: RequestHandler<
  unknown,
  unknown,
  CreateTransactionBody,
  unknown
> = async (req, res, next) => {
  const {
    TransactionType,
    TransactionDate,
    TransactionAmount,
    TransactionTag,
  } = req.body;
  try {
    // Create new transaction
    const newTransaction = new Transaction({
      TransactionType,
      TransactionDate,
      TransactionAmount,
      TransactionTag,
    });

    // Check if transaction is valid
    const validationError = newTransaction.validateSync();
    if (validationError) {
      throw createHttpError(400, validationError);
    }

    // Save transaction to database
    await newTransaction.save();

    res.status(201).json(newTransaction);
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /transactions/page/:pageNumber
 * @description Get all transactions
 * @access Private !!!Not Implemented!!!
 */
interface GetAllTransactionsParams {
  pageNumber: string;
}
export const getAllTransactions: RequestHandler<
  GetAllTransactionsParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const pageNumber = parseInt(req.params.pageNumber);
    const pageSize = 10;
    const transactions = await Transaction.find()
      .sort({ TransactionDate: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    if (transactions.length === 0) throw createHttpError(404, "Page Not Found");

    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

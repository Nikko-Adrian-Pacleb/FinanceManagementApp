import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Transaction from "../models/transactions";
import mongoose from "mongoose";

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
  TransactionType?: string;
  TransactionDate?: Date;
  TransactionAmount?: number;
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
    // Check if page number is valid
    if (isNaN(pageNumber)) throw createHttpError(400, "Invalid Page Number");
    if (pageNumber < 1) throw createHttpError(400, "Invalid Page Number");
    // Get transactions
    const pageSize = 10;
    const transactions = await Transaction.find()
      .sort({ TransactionDate: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    if (transactions.length === 0) {
      throw createHttpError(404, "Page Not Found");
    }

    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /transactions/:id
 * @description Get a transaction by id
 * @access Private !!!Not Implemented!!!
 */
interface GetTransactionByIdParams {
  transactionId: string;
}
export const getTransactionById: RequestHandler<
  GetTransactionByIdParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    // Check if id is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.transactionId)) {
      throw createHttpError(400, "Invalid Id");
    }
    // Get transaction
    const transaction = await Transaction.findById(req.params.transactionId);

    // Check if transaction exists
    if (!transaction) {
      throw createHttpError(404, "Transaction Not Found");
    }

    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

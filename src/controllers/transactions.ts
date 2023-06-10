import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Transaction from "../models/transactions";
import mongoose, { Types } from "mongoose";

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
  TransactionDescription?: string;
  TransactionType?: string;
  TransactionDate?: Date;
  TransactionAmount?: number;
  TransactionTag?: Array<Types.ObjectId>;
}
export const createTransaction: RequestHandler<
  unknown,
  unknown,
  CreateTransactionBody,
  unknown
> = async (req, res, next) => {
  const {
    TransactionDescription,
    TransactionType,
    TransactionDate,
    TransactionAmount,
    TransactionTag,
  } = req.body;
  try {
    // Create new transaction
    const newTransaction = new Transaction({
      TransactionDescription,
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

/**
 * @route PUT /transactions/:id
 * @description Update a transaction by id
 * @access Private !!!Not Implemented!!!
 */
interface UpdateTransactionByIdParams {
  transactionId: string;
}
interface UpdateTransactionByIdBody {
  TransactionDescription?: string;
  TransactionType?: string;
  TransactionDate?: Date;
  TransactionAmount?: number;
  TransactionTag?: Array<Types.ObjectId>;
}
export const updateTransactionById: RequestHandler<
  UpdateTransactionByIdParams,
  unknown,
  UpdateTransactionByIdBody,
  unknown
> = async (req, res, next) => {
  try {
    // Check if id is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.transactionId)) {
      throw createHttpError(400, "Invalid Id");
    }
    // Get transaction
    const updatedTransaction = await Transaction.findById(
      req.params.transactionId
    );

    // Check if transaction exists
    if (!updatedTransaction) {
      throw createHttpError(404, "Transaction Not Found");
    }

    // Update transaction
    const {
      TransactionDescription,
      TransactionType,
      TransactionDate,
      TransactionAmount,
      TransactionTag,
    } = req.body;
    if (TransactionDescription)
      updatedTransaction.TransactionDescription = TransactionDescription;
    if (TransactionType) updatedTransaction.TransactionType = TransactionType;
    if (TransactionDate) updatedTransaction.TransactionDate = TransactionDate;
    if (TransactionAmount)
      updatedTransaction.TransactionAmount = TransactionAmount;
    if (TransactionTag) updatedTransaction.TransactionTag = TransactionTag;

    // Check if transaction is valid
    const validationError = updatedTransaction.validateSync();
    if (validationError) {
      throw createHttpError(400, validationError);
    }

    // Save transaction to database
    await updatedTransaction.save();

    res.status(200).json(updatedTransaction);
  } catch (error) {
    next(error);
  }
};

/**
 * @route DELETE /transactions/:id
 * @description Delete a transaction by id
 * @access Private !!!Not Implemented!!!
 */
interface DeleteTransactionByIdParams {
  transactionId: string;
}
export const deleteTransactionById: RequestHandler<
  DeleteTransactionByIdParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { transactionId } = req.params;
  try {
    // Check if id is valid
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      throw createHttpError(400, "Invalid Id");
    }

    // Delete transaction
    const deletedTransaction = await Transaction.findByIdAndDelete(
      transactionId
    );

    // Check if transaction exists
    if (!deletedTransaction) {
      throw createHttpError(404, "Transaction Not Found");
    }

    res.status(200).redirect("/transactions");
  } catch (error) {
    next(error);
  }
};

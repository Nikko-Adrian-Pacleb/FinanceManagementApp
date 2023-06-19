import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Transaction from "../models/transactions";
import mongoose, { Types } from "mongoose";
import Account from "../models/accounts";
import transactionTags from "../models/transactionTags";

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
  TransactionAccount?: Types.ObjectId;
  TransactionWallet?: Types.ObjectId;
  TransactionTitle?: string;
  TransactionDescription?: string;
  TransactionType?: string;
  TransactionDate?: Date;
  TransactionAmount?: number;
  TransactionTags?: Array<Types.ObjectId>;
}
export const createTransaction: RequestHandler<
  unknown,
  unknown,
  CreateTransactionBody,
  unknown
> = async (req, res, next) => {
  const {
    TransactionAccount,
    TransactionWallet,
    TransactionTitle,
    TransactionDescription,
    TransactionType,
    TransactionDate,
    TransactionAmount,
  } = req.body;
  let { TransactionTags } = req.body;
  try {
    // --- Validation Start --- //
    // Check if transaction account is valid
    if (TransactionAccount && !mongoose.Types.ObjectId.isValid(TransactionAccount)) {
      throw createHttpError(400, "Invalid Transaction Account");
    }
    // Check if transaction wallet is valid
    // !!! UNCOMMENT WHEN WALLETS ARE IMPLEMENTED !!!
    // if (TransactionWallet && !mongoose.Types.ObjectId.isValid(TransactionWallet)) {
    //   throw createHttpError(400, "Invalid Transaction Wallet");
    // }
    // Check if transaction title exists
    if (!TransactionTitle) {
      throw createHttpError(400, "Transaction Title is Required");
    }
    // Check if there is a transaction tag
    if (!TransactionTags) {
      TransactionTags = [];
      // If there is no transaction tag, save it to no tag
      const noTag = await transactionTags.findOne({ TransactionTagName: "No Tag" });
      // If there is no no tag, create one
      if (!noTag) {
        const newNoTag = new transactionTags({
          TransactionTagName: "No Tag",
        });
        await newNoTag.save();
        TransactionTags.push(newNoTag._id);
      } else {
        TransactionTags.push(noTag._id);
      }
    }

    // Create new transaction
    const newTransaction = new Transaction({
      TransactionAccount,
      TransactionWallet,
      TransactionTitle,
      TransactionDescription,
      TransactionType,
      TransactionDate,
      TransactionAmount,
      TransactionTags,
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
    if (isNaN(pageNumber) || pageNumber < 1) {
      throw createHttpError(400, "Invalid Page Number");
    }
    // Get transactions
    const pageSize = 10;
    const transactions = await Transaction.find()
      .sort({ TransactionDate: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Check if there are transactions up to the page requested
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
  TransactionAccount?: Types.ObjectId;
  TransactionWallet?: Types.ObjectId;
  TransactionTitle?: string;
  TransactionDescription?: string;
  TransactionType?: string;
  TransactionDate?: Date;
  TransactionAmount?: number;
  TransactionTags?: Array<Types.ObjectId>;
}
export const updateTransactionById: RequestHandler<
  UpdateTransactionByIdParams,
  unknown,
  UpdateTransactionByIdBody,
  unknown
> = async (req, res, next) => {
  try {
    // Check if transactionId is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.transactionId)) {
      throw createHttpError(400, "Invalid transaction id");
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
      TransactionTitle,
      TransactionDescription,
      TransactionType,
      TransactionDate,
      TransactionAmount,
      TransactionTags,
    } = req.body;

    if (TransactionTitle) {
      updatedTransaction.TransactionTitle = TransactionTitle;
    }
    if (TransactionDescription) {
      updatedTransaction.TransactionDescription = TransactionDescription;
    }
    else {
      updatedTransaction.TransactionDescription = "";
    }
    if (TransactionType) {
      updatedTransaction.TransactionType = TransactionType;
    }
    if (TransactionDate) {
      updatedTransaction.TransactionDate = TransactionDate;
    }
    if (TransactionAmount) {
      updatedTransaction.TransactionAmount = TransactionAmount;
    }
    if (TransactionTags) {
      updatedTransaction.TransactionTags = TransactionTags;
    }
    else {
      updatedTransaction.TransactionTags = [];
      // If there is no transaction tag, save it to no tag
      const noTag = await transactionTags.findOne({ TransactionTagName: "No Tag" });
      // If there is no no tag, create one
      if (!noTag) {
        const newNoTag = new transactionTags({
          TransactionTagName: "No Tag",
        });
        await newNoTag.save();
        updatedTransaction.TransactionTags.push(newNoTag._id);
      } else {
        updatedTransaction.TransactionTags.push(noTag._id);
      }
    }

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

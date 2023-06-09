import { RequestHandler } from "express";
import createHttpError from "http-errors";
import TransactionTag from "../models/transactionTags";
import mongoose, { Types } from "mongoose";

/**
 * @route GET /transactionTags
 * @description Get all transactionTags
 * @access Private !!!Not Implemented!!!
 */
export const getTransactionTags: RequestHandler = async (req, res, next) => {
  try {
    const transactionTags = await TransactionTag.find()
      .sort({ TransactionTag: 1 })
      .limit(10);
    res.status(200).json(transactionTags);
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /transactionTags
 * @description Add a new transactionTag
 * @access Private !!!Not Implemented!!!
 */
interface CreateTransactionTagBody {
  TransactionTagName?: string;
  TransactionTagColor?: string;
}
export const createTransactionTag: RequestHandler<
  unknown,
  unknown,
  CreateTransactionTagBody,
  unknown
> = async (req, res, next) => {
  const { TransactionTagName, TransactionTagColor } = req.body;
  try {
    // Create new transactionTag
    const newTransactionTag = new TransactionTag({
      TransactionTagName,
      TransactionTagColor,
    });

    // Check if transactionTag is valid
    const validationError = newTransactionTag.validateSync();
    if (validationError) {
      throw createHttpError(400, validationError);
    }

    // Save transactionTag to database
    const transactionTag = await newTransactionTag.save();

    res.status(201).json(transactionTag);
  } catch (error) {
    next(error);
  }
};

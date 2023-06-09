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

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
    // Check if transactionTag already exists
    const transactionTagExists = await TransactionTag.findOne({
      TransactionTagName,
    });
    if (transactionTagExists) {
      throw createHttpError(400, "TransactionTag already exists");
    }
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

/**
 * @route GET /transactionTags/:transactionTagId
 * @description Get a transactionTag by id
 * @access Private !!!Not Implemented!!!
 */
interface GetTransactionTagByIdParams {
  transactionTagId: string;
}
export const getTransactionTagById: RequestHandler<
  GetTransactionTagByIdParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    // Check if transactionTagId is valid
    if (!mongoose.isValidObjectId(req.params.transactionTagId)) {
      throw createHttpError(400, "Invalid transactionTag id");
    }
    // Find transactionTag by id
    const transactionTag = await TransactionTag.findById(
      req.params.transactionTagId
    );
    // Check if transactionTag exists
    if (!transactionTag) {
      throw createHttpError(404, "TransactionTag not found");
    }
    res.status(200).json(transactionTag);
  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /transactionTags/:transactionTagId
 * @description Update a transactionTag by id
 * @access Private !!!Not Implemented!!!
 */
interface UpdateTransactionTagByIdParams {
  transactionTagId: string;
}
interface UpdateTransactionTagByIdBody {
  TransactionTagName?: string;
  TransactionTagColor?: string;
}
export const updateTransactionTagById: RequestHandler<
  UpdateTransactionTagByIdParams,
  unknown,
  UpdateTransactionTagByIdBody,
  unknown
> = async (req, res, next) => {
  try {
    // Check if transactionTagName already exists
    const transactionTagExists = await TransactionTag.findOne({
      TransactionTagName: req.body.TransactionTagName,
    });
    if (transactionTagExists) {
      throw createHttpError(400, "TransactionTag already exists");
    }

    // Check if transactionTagId is valid
    if (!mongoose.isValidObjectId(req.params.transactionTagId)) {
      throw createHttpError(400, "Invalid transactionTag id");
    }

    // Get transactionTag by id
    const updatedTransactionTag = await TransactionTag.findById(
      req.params.transactionTagId
    );

    // Check if transactionTag exists
    if (!updatedTransactionTag) {
      throw createHttpError(404, "TransactionTag not found");
    }

    // Update transactionTag
    if (req.body.TransactionTagName) {
      updatedTransactionTag.TransactionTagName = req.body.TransactionTagName;
    }
    if (req.body.TransactionTagColor) {
      updatedTransactionTag.TransactionTagColor = req.body.TransactionTagColor;
    }

    // Check if transactionTag is valid
    const validationError = updatedTransactionTag.validateSync();
    if (validationError) {
      throw createHttpError(400, validationError);
    }

    // Save transactionTag to database
    await updatedTransactionTag.save();

    res.status(200).json(updatedTransactionTag);
  } catch (error) {
    next(error);
  }
};

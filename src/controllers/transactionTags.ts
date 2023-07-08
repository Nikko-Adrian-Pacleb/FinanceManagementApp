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
      .sort({ updateAt: -1 })
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
  TransactionTagAccount?: Types.ObjectId;
  TransactionTagName?: string;
  TransactionTagColor?: string;
}
export const createTransactionTag: RequestHandler<
  unknown,
  unknown,
  CreateTransactionTagBody,
  unknown
> = async (req, res, next) => {
  const { TransactionTagAccount, TransactionTagName, TransactionTagColor } = req.body;
  try {
    // Check if Account ID is valid
    if (TransactionTagAccount && !mongoose.Types.ObjectId.isValid(TransactionTagAccount)) {
      throw createHttpError(400, "Invalid Account ID");
    }
    // Check if transactionTag already exists
    const transactionTagExists = await TransactionTag.findOne({
      TransactionTagAccount: TransactionTagAccount,
      TransactionTagName: TransactionTagName,
    });
    if (transactionTagExists) {
      throw createHttpError(400, "TransactionTag already exists");
    }
    // Create new transactionTag
    const newTransactionTag = new TransactionTag({
      TransactionTagAccount,
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
 * @route GET /transactionTags/page/:pageNumber
 * @description Get all transactionTags by page
 * @access Private !!!Not Implemented!!!
 */
interface GetAllTransactionTagsParams {
  pageNumber: string;
}
export const getAllTransactionTags: RequestHandler<
  GetAllTransactionTagsParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const pageNumber = parseInt(req.params.pageNumber);
    // Check if page number is valid
    if (isNaN(pageNumber) || pageNumber < 1) {
      throw createHttpError(400, "Invalid page number");
    }
    // Get TransactionTags
    const pageSize = 10;
    const transactionTags = await TransactionTag.find()
      .sort({ updatedAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    // Check if there are transactionTags up to the page requested
    if (transactionTags.length === 0) {
      throw createHttpError(404, "Page Not Found");
    }

    res.status(200).json(transactionTags);
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
    // Get transactionTag
    const updatedTransactionTag = await TransactionTag.findById(
      req.params.transactionTagId
    );
    // Check if transactionTag exists
    if (!updatedTransactionTag) {
      throw createHttpError(404, "TransactionTag not found");
    }

    // Update transactionTag
    const { TransactionTagName, TransactionTagColor } = req.body;
    if (TransactionTagName) {
      updatedTransactionTag.TransactionTagName = TransactionTagName;
    }
    if (TransactionTagColor) {
      updatedTransactionTag.TransactionTagColor = TransactionTagColor;
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

/**
 * @route DELETE /transactionTags/:transactionTagId
 * @description Delete a transactionTag by id
 * @access Private !!!Not Implemented!!!
 */
interface DeleteTransactionTagByIdParams {
  transactionTagId: string;
}
export const deleteTransactionTagById: RequestHandler<
  DeleteTransactionTagByIdParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    // Check if transactionTagId is valid
    if (!mongoose.isValidObjectId(req.params.transactionTagId)) {
      throw createHttpError(400, "Invalid transactionTag id");
    }

    // Delete transactionTag
    const transactionTag = await TransactionTag.findByIdAndDelete(
      req.params.transactionTagId
    );

    // Check if transactionTag exists
    if (!transactionTag) {
      throw createHttpError(404, "TransactionTag not found");
    }

    res.status(200).redirect("/transactionTags");
  } catch (error) {
    next(error);
  }
};

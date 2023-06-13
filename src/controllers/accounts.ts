import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import Account from "../models/accounts";
import mongoose from "mongoose";

/**
 * @route GET /accounts
 * @description Get all accounts
 * @access Private !!!Not Implemented!!!
 */
export const getAccounts: RequestHandler = async (req, res, next) => {
  try {
    const accounts = await Account.find({}, "AccountId AccountWallets")
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).json(accounts);
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /accounts/register
 * @description Add a new account
 * @access Private !!!Not Implemented!!!
 */
interface CreateAccountBody {
  AccountId?: string;
  AccountPin?: string;
}
export const createAccount: RequestHandler<
  unknown,
  unknown,
  CreateAccountBody,
  unknown
> = async (req, res, next) => {
  const { AccountId, AccountPin } = req.body;
  try {
    // Check if fields are empty
    if (!AccountId || !AccountPin) {
      throw createHttpError(400, "Please fill in all fields");
    }
    // Check if account exists
    const account = await Account.findOne({ AccountId });
    if (account) {
      throw createHttpError(400, "Account already exists");
    }

    // // Hash account pin
    const saltRound = 10;
    bcrypt.hash(
      AccountPin,
      saltRound,
      async function (error, hashedAccountPin) {
        if (error) {
          throw createHttpError(500, error);
        }
        // Create new account
        const newAccount = new Account({
          AccountId,
          AccountPin: hashedAccountPin,
        });

        // Check if account is valid
        const validationError = newAccount.validateSync();
        if (validationError) {
          throw createHttpError(400, validationError);
        }

        // Save account
        const savedAccount = await newAccount.save();
        res.status(201).json(savedAccount);
      }
    );
  } catch (error) {
    next(error);
  }
};

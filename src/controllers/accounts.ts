import { RequestHandler } from "express";
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

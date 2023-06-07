import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Transaction from "../models/transactions";

export const getTransactions: RequestHandler = async (req, res, next) => {
  try {
    const transaxtions = await Transaction.find().exec();
    res.status(200).json(transaxtions);
  } catch (error) {
    next(error);
  }
};

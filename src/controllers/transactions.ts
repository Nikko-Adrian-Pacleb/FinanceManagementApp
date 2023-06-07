import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const getTransactions: RequestHandler = (req, res, next) => {
  try {
    res.status(200).send("Get Transactions");
  } catch (error) {
    next(error);
  }
};

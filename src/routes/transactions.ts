import express, { NextFunction } from "express";
import createHttpError from "http-errors";
import * as TransactionsController from "../controllers/transactions";

const router = express.Router();

//-- Routes Start --//
router.get("/", TransactionsController.getTransactions);
router.post("/", TransactionsController.createTransaction);
router.get("/page/:pageNumber", TransactionsController.getAllTransactions);
router.get("/:transactionId", TransactionsController.getTransactionById);
router.put("/:transactionId", TransactionsController.updateTransactionById);
//-- Routes End --//

export default router;

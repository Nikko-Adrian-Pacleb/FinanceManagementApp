import express, { NextFunction } from "express";
import createHttpError from "http-errors";
import * as TransactionsController from "../controllers/transactions";

const router = express.Router();

//-- Routes Start --//
router.get("/", TransactionsController.getTransactions);

router.post("/", TransactionsController.createTransaction);
//-- Routes End --//

export default router;

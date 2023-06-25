import express, { NextFunction } from "express";
import * as TransactionsController from "../controllers/transactions";
import { isAuth } from "../middleware/Authenticated";

const router = express.Router();

//-- Routes Start --//
router.get("/", isAuth, TransactionsController.getTransactions);
router.post("/", isAuth, TransactionsController.createTransaction);
router.get("/page/:pageNumber", isAuth, TransactionsController.getAllTransactions);
router.get("/:transactionId", isAuth, TransactionsController.getTransactionById);
router.put("/:transactionId", isAuth, TransactionsController.updateTransactionById);
router.delete("/:transactionId", isAuth, TransactionsController.deleteTransactionById);
//-- Routes End --//

export default router;

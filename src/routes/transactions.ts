import express from "express";
import * as TransactionsController from "../controllers/transactions";

const router = express.Router();

//-- Routes Start --//
router.get("/", TransactionsController.getTransactions);

//-- Routes End --//

export default router;

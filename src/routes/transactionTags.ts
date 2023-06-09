import express from "express";
import createHttpError from "http-errors";
import * as TransactionTagsController from "../controllers/transactionTags";

const router = express.Router();

//-- Routes Start --//
router.get("/", TransactionTagsController.getTransactionTags);
router.post("/", TransactionTagsController.createTransactionTag);
//-- Routes End --//

export default router;

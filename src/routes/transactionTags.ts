import express from "express";
import createHttpError from "http-errors";
import * as TransactionTagsController from "../controllers/transactionTags";

const router = express.Router();

//-- Routes Start --//
router.get("/", TransactionTagsController.getTransactionTags);
router.post("/", TransactionTagsController.createTransactionTag);
router.get(
  "/:transactionTagId",
  TransactionTagsController.getTransactionTagById
);
router.put(
  "/:transactionTagId",
  TransactionTagsController.updateTransactionTagById
);
router.delete(
  "/:transactionTagId",
  TransactionTagsController.deleteTransactionTagById
);
//-- Routes End --//

export default router;

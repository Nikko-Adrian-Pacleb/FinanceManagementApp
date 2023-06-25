import express from "express";
import * as TransactionTagsController from "../controllers/transactionTags";
import { isAuth } from "../middleware/Authenticated";
const router = express.Router();

//-- Routes Start --//
router.get("/", isAuth, TransactionTagsController.getTransactionTags);
router.post("/", isAuth, TransactionTagsController.createTransactionTag);
router.get(
  "/page/:pageNumber",
  isAuth,
  TransactionTagsController.getAllTransactionTags
);
router.get(
  "/:transactionTagId",
  isAuth,
  TransactionTagsController.getTransactionTagById
);
router.put(
  "/:transactionTagId",
  isAuth,
  TransactionTagsController.updateTransactionTagById
);
router.delete(
  "/:transactionTagId",
  isAuth,
  TransactionTagsController.deleteTransactionTagById
);
//-- Routes End --//

export default router;

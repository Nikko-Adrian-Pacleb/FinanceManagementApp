import express from "express";
import * as AccountsController from "../controllers/accounts";

const router = express.Router();

//-- Routes Start --//
router.get("/", AccountsController.getAccounts);
//-- Routes End --//

export default router;

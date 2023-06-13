import express from "express";
import { isAuth } from "../middleware/Authenticated";
import * as AccountsController from "../controllers/accounts";

const router = express.Router();

//-- Routes Start --//
router.get("/", isAuth, AccountsController.getAccounts);
router.get;
//-- Routes End --//

export default router;

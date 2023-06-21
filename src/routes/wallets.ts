import express from "express";
import { isAuth } from "../middleware/Authenticated";
import * as WalletsController from "../controllers/wallets";

const router = express.Router();

//-- Routes Start --//
router.get("/", isAuth, WalletsController.getWallets);
router.post("/", isAuth, WalletsController.createWallet);
router.get("/:WalletId", isAuth, WalletsController.getWallet);
//-- Routes End --//

export default router;
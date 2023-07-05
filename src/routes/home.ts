import express from "express";
import { isAuth } from "../middleware/Authenticated";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import Wallet from "../models/wallets";

const router = express.Router();

//-- Routes Start --//
router.get("/", isAuth,  async (req: any, res, next) => {
  try{
    if (!req.user) {
      throw createHttpError(401, "Unauthorized");
    }
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      throw createHttpError(400, "Invalid Account ID");
    }
    const wallets = await Wallet.find({ WalletAccount: req.user._id });
    res.render("home_page", {
      title: "Home",
      user: req.user,
      wallets: wallets,
    });
  }
  catch(error){
    next(error);
  }
  
});

//-- Routes End --//

export default router;

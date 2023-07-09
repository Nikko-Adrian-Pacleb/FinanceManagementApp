import express from "express";
import { isAuth } from "../middleware/Authenticated";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import Wallet from "../models/wallets";
import TransactionTag from "../models/transactionTags";

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
    const tags = await TransactionTag.find({ TransactionTagAccount: req.user._id });
    const dateArr = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric'}).split('/'); // MM/DD/YYYY
    res.render("home_page", {
      site: "/",
      title: "Home",
      user: req.user,
      wallets: wallets,
      dateNow: dateArr[2] + "-" + dateArr[0] + "-" + dateArr[1],
      tags: tags,
    });
  }
  catch(error){
    next(error);
  }
  
});

//-- Routes End --//

export default router;

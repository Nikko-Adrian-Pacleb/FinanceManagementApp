import express from "express";
import { isAuth } from "../middleware/Authenticated";
import mongoose from "mongoose";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Wallet from "../models/wallets";

const router = express.Router();

type typeOfUserObject = object;
type RequestWithUser = Request & {user: typeOfUserObject};
function assertHasUser(req: Request): asserts req is RequestWithUser {
    if (!( "user" in req)) {
        throw new Error("Request object without user found unexpectedly");
    }
}
//-- Routes Start --//
router.get("/", isAuth, async (req, res, next) => {
  try{
    if (!req.user) {
      throw createHttpError(401, "Unauthorized");
    }
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      throw createHttpError(400, "Invalid Account ID");
    }
    const wallets = await Wallet.find({ AccountId: req.user._id });
    res.render("home_page", {
      title: "Home",
      user: req.user,
    });
  }
  catch(error){
    next(error);
  }
  
});
//-- Routes End --//

export default router;

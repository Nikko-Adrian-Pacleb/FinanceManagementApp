import express from "express";
import { isAuth } from "../middleware/Authenticated";

const router = express.Router();

//-- Routes Start --//
router.get("/", isAuth, (req, res, next) => {
  res.redirect("/accounts");
});
//-- Routes End --//

export default router;

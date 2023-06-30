import express from "express";
import { isAuth } from "../middleware/Authenticated";

const router = express.Router();

//-- Routes Start --//
router.get("/", isAuth, (req, res, next) => {
  res.render("home_page", {
    title: "Home",
  });
});
//-- Routes End --//

export default router;

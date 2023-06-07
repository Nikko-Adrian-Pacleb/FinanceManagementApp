import express from "express";

const router = express.Router();

//-- Routes Start --//
router.get("/", (req, res, next) => {
  res.status(200).send("Home");
});
//-- Routes End --//

export default router;

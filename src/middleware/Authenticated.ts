import { RequestHandler } from "express";
export const isAuth: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/accounts/login");
  }
};

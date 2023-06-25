import { RequestHandler } from "express";
export const isAuth: RequestHandler<
  unknown,
  unknown,
  unknown,
  { username: string; password: string }
> = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/accounts/login");
  }
};

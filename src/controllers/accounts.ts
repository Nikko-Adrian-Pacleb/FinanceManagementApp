import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import Account from "../models/accounts";
import mongoose from "mongoose";
import passport from "passport";

/**
 * @route GET /accounts
 * @description Get accounts homepage
 * @access Private !!!Not Implemented!!!
 */
export const getAccounts: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw createHttpError(401, "Unauthorized");
    }
    res.send(req.user);
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /accounts/register
 * @description Add a new account
 * @access Private !!!Not Implemented!!!
 */
interface CreateAccountBody {
  AccountId?: string;
  AccountPin?: string;
}
export const createAccount: RequestHandler<
  unknown,
  unknown,
  CreateAccountBody,
  unknown
> = async (req, res, next) => {
  const { AccountId, AccountPin } = req.body;
  try {
    // Check if fields are empty
    if (!AccountId || !AccountPin) {
      throw createHttpError(400, "Please fill in all fields");
    }
    // Check if account exists
    const account = await Account.findOne({ AccountId });
    if (account) {
      throw createHttpError(400, "Account already exists");
    }

    // // Hash account pin
    const saltRound = 10;
    bcrypt.hash(
      AccountPin,
      saltRound,
      async function (error, hashedAccountPin) {
        if (error) {
          throw createHttpError(500, error);
        }
        // Create new account
        const newAccount = new Account({
          AccountId,
          AccountPin: hashedAccountPin,
        });

        // Check if account is valid
        const validationError = newAccount.validateSync();
        if (validationError) {
          throw createHttpError(400, validationError);
        }

        // Save account
        const savedAccount = await newAccount.save();
        res.status(201).json(savedAccount);
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /accounts/login
 * @description Get an account by id
 * @access Private !!!Not Implemented!!!
 */
export const getLoginPage: RequestHandler = (req, res) => {
  res.status(200).render("login", {
    title: "Login Page"
  })
};

/**
 * @route POST /accounts/login
 * @description Login to an account
 * @access Private !!!Not Implemented!!!
 */
export const loginAccount: RequestHandler = async (req, res, next) => {
  console.log(req.body)
  passport.authenticate(
    "local-register",
    (error: any, account: any, info: any) => {
      if (!account) {
        return res.status(400).json({ message: info.message });
      }
      req.logIn(account, (error) => {
        if (error) {
          return res.status(400).json({ message: error });
        }
        return res.status(200).redirect("/")
      });
    }
  )(req, res, next);
};

/**
 * @route GET /accounts/logout
 * @description Logout of an account
 * @access Private !!!Not Implemented!!!
 */
export const logoutAccount: RequestHandler = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: err });
    }
  });
  res.redirect("/accounts/login");
};

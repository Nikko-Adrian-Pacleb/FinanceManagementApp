import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import createHttpError, { HttpError } from "http-errors";
import Account from "../models/accounts";

passport.use(
  "local-register",
  new LocalStrategy(
    {
      usernameField: "AccountId",
      passwordField: "AccountPin",
      passReqToCallback: true,
    },
    async (req, AccountId, AccountPin, done) => {
      try {
        // Check if fields are empty
        if (!AccountId || !AccountPin) {
          throw createHttpError(400, "Please fill in all fields");
        }
        const account = await Account.findOne({ AccountId });
        // Check if account exists
        if (!account) {
          return done(null, false, { message: "Incorrect AccountId." });
        }
        // Check if account pin is correct
        const isMatch = await bcrypt.compare(AccountPin, account.AccountPin);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect AccountPin." });
        }
        // Return account
        return done(null, account);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((account: any, done) => {
  done(null, account.id);
});

passport.deserializeUser(async (id, done) => {
  const account = await Account.findById(id);
  done(null, account);
});

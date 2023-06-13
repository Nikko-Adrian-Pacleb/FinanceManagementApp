import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import Account, { AccountDocument } from "../models/accounts";

passport.use(
  new LocalStrategy(
    {
      usernameField: "AccountId",
      passwordField: "AccountPin",
      passReqToCallback: true,
    },
    async (req, AccountId, AccountPin, done) => {
      try {
        const account = await Account.findOne({ AccountId });
        // Check if account exists
        if (!account) {
          return done(null, false, { message: "Incorrect username." });
        }
        // Check if account pin is correct
        const isMatch = await bcrypt.compare(AccountPin, account.AccountPin);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        // Return account
        return done(null, account);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser<any, any>((req, account, done) => {
  done(null, account);
});

passport.deserializeUser((id, done) => {
  Account.findById(id, (err: NativeError, account: AccountDocument) => {
    done(err, account);
  });
});

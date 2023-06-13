import "dotenv/config";
import env from "./util/validateEnv";
import express, { Request, Response, NextFunction } from "express";
// Routes
import homeRoute from "./routes/home";
import transacationsRoute from "./routes/transactions";
import transactionTagsRoute from "./routes/transactionTags";
import accountsRoute from "./routes/accounts";
// Middleware
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
// Auth
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

// Session Setup
app.use(
  session({
    secret: env.SESSION_SECRET,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
      collectionName: "sessions",
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// Passport Setup
import "./util/passport";
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", homeRoute);
app.use("/transactions", transacationsRoute);
app.use("/transactionTags", transactionTagsRoute);
app.use("/accounts", accountsRoute);

app.use((req, res, next) => {
  next(createHttpError(404, "Page Not Found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occurred!";
  let statusCode = 500;
  if (isHttpError(error)) {
    errorMessage = error.message;
    statusCode = error.statusCode;
  }
  res.status(statusCode).send(errorMessage);
});

export default app;

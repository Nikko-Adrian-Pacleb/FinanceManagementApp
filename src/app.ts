import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import homeRoute from "./routes/home";
// Routes
import transacationsRoute from "./routes/transactions";
import transactionTagsRoute from "./routes/transactionTags";
import accountsRoute from "./routes/accounts";
// Middleware
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

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

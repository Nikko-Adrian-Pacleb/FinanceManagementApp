import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import transacationsRoutes from "./routes/transactions";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use("/transactions", transacationsRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Page Not Found"));
});

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

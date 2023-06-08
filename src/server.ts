import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;

const connection_string =
  env.NODE_ENV === "development"
    ? env.MONGO_CONNECTION_STRING_DEV
    : env.MONGO_CONNECTION_STRING;

mongoose.connect(connection_string).then(() => {
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});

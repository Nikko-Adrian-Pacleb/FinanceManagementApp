import { cleanEnv } from "envalid";
import { str, port } from "envalid/dist/validators";

export default cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "production"],
    default: "development",
  }),
  MONGO_CONNECTION_STRING: str(),
  MONGO_CONNECTION_STRING_DEV: str(),
  PORT: port(),
  SESSION_SECRET: str(),
});

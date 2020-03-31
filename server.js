import * as dotenv from "dotenv";
import express from "express";
import routes from "./routes";
import cors from "cors";

dotenv.config();

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const app = express();
const port = IS_PRODUCTION ? 80 : 8080;

// Add middleware
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

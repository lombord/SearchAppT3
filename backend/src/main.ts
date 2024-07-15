import express from "express";
import dotenv from "dotenv";
import path from "path";
import middlewares from "./middlewares";
import router from "./routers";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const port = process.env.BACKEND_PORT || 3000;

const app = express();

app.use(...middlewares);

app.use("/api", router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

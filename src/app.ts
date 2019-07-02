import express from "express";
import router from "./router";
import { PORT } from "./config";

import bodyParser from "body-parser";

const app = express();
app.set("port", process.env.port || PORT);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router);

export default app;

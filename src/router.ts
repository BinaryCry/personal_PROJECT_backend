import { Router, Request, Response } from "express";
import { getLogger } from "./utils/logger";
import { resolve } from "path";
import { getDateTime, getUser } from "./utils";
import qs from "querystring";
import { IncomingForm, Fields, Files } from "formidable";
import { getExtension } from "mime";
import { Client } from "pg";
import { createHash } from "crypto";
import { createReadStream } from "fs";

const router = Router();
const logger = getLogger(resolve(__dirname, "..", "logs"));

router.get("/api_old", async (req: Request, res: Response) => {
  const client = new Client();
  await client.connect();
  const db_res = await client.query(`SELECT version()`);
  console.log(db_res.rows);
  await client.end();

  logger.log(`${getDateTime()}, ${getUser()}: ${req.url}`);

  console.log(
    createHash("sha512")
      .update("loooong_pa$$w0rD")
      .digest("hex")
  );

  const html$ = createReadStream(
    resolve(__dirname, "..", "public", "index.html")
  );
  html$.on("open", () => {
    res.type("text/html");
    res.charset = "utf-8";
    html$.pipe(res);
  });

  html$.on("error", err => {
    console.log(err);
    res.status(500);
    res.send();
  });
});

router.post("/api/user/:id", (req: Request, res: Response) => {
  console.log(
    req.params,
    // req.query,
    // req.route,
    req.body,
    // req.cookies,
    // req.signedCookies,
    // req.ip,
    // req.xhr,
    // req.acceptsLanguages()
    req.query
    // req.headers
  );
  res.redirect(303, "/");
  // res.redirect(303, "/user"); // .get() need
});

router.post("/api/upload", (req: Request, res: Response) => {
  const form = new IncomingForm();
  form.parse(req);
  form.on("fileBegin", (name, file) => {
    if (file.type === "image/jpeg") {
      file.path = resolve(
        __dirname,
        "..",
        "uploads",
        `${name}.${getExtension(file.type)}`
      );
    } else {
      req.socket.end();
      res.status(400).send();
    }
  });
  form.on("file", (name, file) => {
    console.log(`Uploaded: ${name}.${getExtension(file.type)}, ${file.type}`);
    res.end();
  });
});

// router.get("/api/path/is/here", (req: Request, res: Response) => {
//   res.status(200).send("Everysing is fine!");
// });

export default router;

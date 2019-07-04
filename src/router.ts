import { Router, Request, Response } from "express";
import { getLogger } from "./utils/logger";
import { resolve } from "path";
import { getDateTime, getUser } from "./utils";
import { IncomingForm } from "formidable";
import { getExtension } from "mime";
import { Client } from "pg";
import { createHash } from "crypto";
import { createReadStream, fstat, unlink } from "fs";
import uploadHandler from "./handlers/uploaded";

const router = Router();
const logger = getLogger(resolve(__dirname, "..", "logs"));

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

router.get("/api/uploaded", (req: Request, res: Response) => {
  uploadHandler(req, res);
});

router.post("/api/upload", (req: Request, res: Response) => {
  const form = new IncomingForm();
  form.parse(req);
  form.on("fileBegin", (name, file) => {
    console.log(`>>>>>>>>> ${file.type}`);
    if (file.type.match("image")) {
      file.path = resolve(
        __dirname,
        "..",
        "uploads",
        `${name}.${getExtension(file.type)}`
      );
      res.status(201);
    } else res.status(415);
  });
  form.on("file", (name, file) => {
    if (!file.type.match("image")) {
      unlink(file.path, (err: Error) => {
        if (err) res.status(500).send();
        else res.send();
      });
    } else {
      console.log(`Uploaded: ${name}.${getExtension(file.type)}, ${file.type}`);
      res.send();
    }
  });
});

// router.get("/api/path/is/here", (req: Request, res: Response) => {
//   res.status(200).send("Everysing is fine!");
// });

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

export default router;

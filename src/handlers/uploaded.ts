import { readdir } from "fs";
import { Request, Response } from "express";
import { resolve } from "path";

export default (req: Request, res: Response) => {
  const uploadDirPath = resolve(process.env.PWD, "uploads");
  readdir(uploadDirPath, (err: Error, list) => {
    if (err) res.status(500).send("Something went wrong");
    if (list.length > 0)
      res
        .type("application/json")
        .status(200)
        .send(JSON.stringify({ fileNames: list.sort() }));
    else {
      res.statusMessage = "No data";
      res.status(204).send();
    }
  });
};

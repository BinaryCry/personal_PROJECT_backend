import { createWriteStream } from "fs";
import { resolve } from "path";

export const fileOptions = {
  flags: "a+",
  encoding: "utf8",
  mode: 0o644
};

export const getLogger = (logsFolderPath: string): Console => {
  const logInfo$ = createWriteStream(
    resolve(logsFolderPath, "log.txt"),
    fileOptions
  );
  const logErrors$ = createWriteStream(
    resolve(logsFolderPath, "err.txt"),
    fileOptions
  );
  return new console.Console(logInfo$, logErrors$);
};

import http from "node:http";
import path from "node:path";
import fsPromises from "node:fs/promises";
import buildPages from "./utils/buildPages.js";
import { clearBuildDir, copyFaviconIco, symlinkStatics } from "./utils/fileTasks.js";
import { FILE_TYPE, getFilePath, getFileType, getMimeType } from "./utils/serveFiles.js";

const HOST = "localhost";
const PORT = 4200;

const server = http.createServer();

server.on("request", async (req, res) => {
  const dt = formatDate(new Date());
  console.log(`[ ${dt} ] ${req.method} ${req.url}`);

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end();
    return;
  }

  try {
    const filePath = getFilePath(req.url);
    const fileExtension = path.extname(filePath);

    const fileType = getFileType(fileExtension);

    if (fileType === FILE_TYPE.INVALID) {
      res.statusCode = 415;
      res.end("Unsupported Media Type");
      return;
    }

    res.statusCode = 200;

    const isTextFile = Boolean(fileType); // if text: 1 -> true, if bin: 0 -> false;
    const encoding = isTextFile ? "utf-8" : null;
    const fileContent = await fsPromises.readFile(filePath, { encoding });

    let contentType = getMimeType(fileExtension);
    if (encoding) {
      contentType += `; charset=${encoding}`;
    }

    res.setHeader("Content-Type", contentType);
    res.end(fileContent);
  } catch (err) {
    if (err.code === "ENOENT") {
      res.statusCode = 404;
      res.end("Not Found");
      return;
    }
    throw err;
  }
});

server.on("error", (req, res) => {
  res.statusCode = 500;
  res.end("Internal Server Error");
});

server.listen(PORT, HOST, async () => {
  await clearBuildDir();
  await buildPages({ skipMinification: true });
  await symlinkStatics();
  await copyFaviconIco();

  console.log("Completed fresh development build");
  console.log(`Listening at http://${HOST}:${PORT}`);
});

const dtFormatter = new Intl.DateTimeFormat("en-GB", {
  timeStyle: "medium",
  hour12: false,
});

/**
 * Formats Date object as `hh:mm:ss` string.
 * @param {Date} dateObj instance of `Date`
 * @returns {string} formatted string
 * @example
 * formatDate(new Date()) -> '15:19:29'
 */
function formatDate(dateObj) {
  return dtFormatter.format(dateObj);
}

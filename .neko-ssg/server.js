import http from "node:http";
import path from "node:path";
import fsPromises from "node:fs/promises";
import runBuild from "./utils/runBuild.js";
import {
  checkNotFoundPageExists,
  FILE_TYPE,
  getFilePath,
  getFileType,
  getMimeType,
  getNotFoundPageHtml,
} from "./utils/serveFiles.js";

const cliArguments = process.argv.slice(2);
const skipMinification = cliArguments.includes("--skip-minify");
const skipBuild = cliArguments.includes("--skip-build"); // TODO: replace with --dev, --prod flag

const HOST = "localhost";
const PORT = 4200;

// TODO: try HTTP/2 server
const server = http.createServer();
let isNotFoundPageExists = false;

server.on("request", async (req, res) => {
  const dt = formatDate(new Date());
  console.log(`[ ${dt} ] ${req.method} ${req.url}`);

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end("Method Not Allowed"); // TODO: add message 405/Method Not Allowed
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

      if (isNotFoundPageExists) {
        res.setHeader("Content-Type", getMimeType(".html"));
        res.end(await getNotFoundPageHtml());
        return;
      }

      res.end("Not Found");
      return;
    }

    console.error(err);
    res.statusCode = 500;
    res.end("Internal Server Error");
    // TODO: replace with response 500/Internal Server Error
    // throw err;
  }
});

server.on("error", (err) => {
  // TODO: replace callback with loggin error (server failed to init)
  console.error(err);
});

server.listen(PORT, HOST, async () => {
  if (!skipBuild) {
    await runBuild({ skipMinification });
  } else {
    console.log("Skipping fresh build (using existing)");
  }

  isNotFoundPageExists = await checkNotFoundPageExists();
  if (!isNotFoundPageExists) {
    console.warn("Missing /not_found page");
  }

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

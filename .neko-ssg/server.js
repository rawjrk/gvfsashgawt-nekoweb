import http from "node:http";
import path from "node:path";
import fsPromises from "node:fs/promises";
import appDir from "./utils/appDir.js";
import buildPages from "./utils/buildPages.js";
import { clearBuildDir, symlinkStatics } from "./utils/fileTasks.js";

const HOST = "localhost";
const PORT = 4200;

const server = http.createServer();

server.on("request", async (req, res) => {
  try {
    const filePath = requestUrlToFilePath(req.url);
    const fileExtension = path.extname(filePath);

    res.statusCode = 200;

    switch (fileExtension) {
      case ".html":
        const htmlContent = await fsPromises.readFile(filePath, "utf-8");
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(htmlContent);
        return;

      case ".css":
        const cssContent = await fsPromises.readFile(filePath, "utf-8");
        res.setHeader("Content-Type", "text/css; charset=utf-8");
        res.end(cssContent);
        return;

      case ".js":
        const jsContent = await fsPromises.readFile(filePath, "utf-8");
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        res.end(jsContent);
        return;

      default:
        res.end("Hello world!");
    }
  } catch (err) {
    if (err.code === "ENOENT") {
      res.statusCode = 404;
      res.end("404: NOT FOUND");
      return;
    }
    throw err;
  }
});

server.listen(PORT, HOST, async () => {
  await clearBuildDir();
  await buildPages();
  await symlinkStatics();

  console.log("Completed fresh development build");
  console.log(`Listening at http://${HOST}:${PORT}`);
});

function requestUrlToFilePath(url) {
  const isExtensionSpecified = path.extname(url);
  const addExtension = isExtensionSpecified ? "" : ".html";

  const relativePath = url === "/" ? "index.html" : `${url}${addExtension}`;
  const absolutePath = path.join(appDir, "build", relativePath);

  return absolutePath;
}

import fsPromises from "node:fs/promises";
import path from "node:path";

import appDir from "./utils/appDir.js";

(async () => {
  const buildDir = path.join(appDir, "build"); // TODO: buildDir + appDir to be provided from args
  await fsPromises.rm(buildDir, { force: true, recursive: true });
  console.log("Successfully cleared build files");
})();

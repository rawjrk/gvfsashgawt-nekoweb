import buildPages from "./utils/buildPages.js";
import { clearBuildDir, copyScripts, copyStaticFiles, copyStyles } from "./utils/fileTasks.js";

(async () => {
  await clearBuildDir();
  await buildPages();

  await copyStaticFiles();
  await copyStyles();
  await copyScripts();

  console.log("Build successful!");
})();

import buildPages from "./utils/buildPages.js";
import {
  clearBuildDir,
  copyFaviconIco,
  copyScripts,
  copyStaticFiles,
  copyStyles,
} from "./utils/fileTasks.js";

(async () => {
  await clearBuildDir();
  await buildPages();

  await copyFaviconIco();
  await copyStaticFiles();
  await copyStyles();
  await copyScripts();

  console.log("Successfully completed fresh build");
})();

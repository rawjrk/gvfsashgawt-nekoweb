import buildPages from "./utils/buildPages.js";
import {
  clearBuildDir,
  copyScripts,
  copyStaticFiles,
  copyStyles,
} from "./utils/fileTasks.js";

(async () => {
  await clearBuildDir();

  await Promise.all([
    buildPages(),
    copyStaticFiles(),
    copyStyles(),
    copyScripts(),
  ]);

  console.log("Build successful!");
})();

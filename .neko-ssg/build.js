import buildPages from "./utils/buildPages.js";
import {
  clearBuildDir,
  copyFaviconIco,
  copyScripts,
  copyStaticFiles,
  copyStyles,
} from "./utils/fileTasks.js";

const cliArguments = process.argv.slice(2);
const skipMinification = cliArguments.includes("--skip-minify");

(async () => {
  await clearBuildDir();
  await buildPages({ skipMinification });

  await copyFaviconIco();
  await copyStaticFiles();
  await copyStyles({ skipMinification });
  await copyScripts({ skipMinification });

  console.log("Successfully completed fresh build");
})();

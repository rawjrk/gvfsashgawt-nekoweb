import { clearBuildDir } from "./utils/fileTasks.js";

(async () => {
  await clearBuildDir();
  console.log("Successfully cleared build files");
})();

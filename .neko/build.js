import buildPages from "./utils/buildPages.js";

(async () => {
  await buildPages();
  console.log("Successfully written files to /build");
})();

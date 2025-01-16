const buildPages = require("./utils/buildPages");

(async () => {
  await buildPages();
  console.log("Successfully written files to /build");
})();

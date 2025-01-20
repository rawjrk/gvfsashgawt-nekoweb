import runBuild from "./utils/runBuild.js";

const cliArguments = process.argv.slice(2);
const skipMinification = cliArguments.includes("--skip-minify");

(async () => {
  await runBuild({ skipMinification });
})();

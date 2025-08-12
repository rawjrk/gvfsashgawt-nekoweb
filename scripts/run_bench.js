import { exec } from "node:child_process";

(async () => {
  const isWindows = process.platform === "win32";

  if (isWindows) {
    await runCommand("powershell .\\scripts\\run_bench.ps1");
  } else {
    await runCommand("/bin/sh ./scripts/run_bench.sh");
  }
})();

/**
 * Executes command.
 * @param {string} command shell command
 * @returns {Promise<void>}
 */
async function runCommand(command) {
  return new Promise((resolve, reject) => {
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      if (stderr) {
        console.error(stderr);
      }

      console.log(stdout);
      resolve();
    });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });
}

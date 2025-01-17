import path from "node:path";
import fsPromises from "node:fs/promises";
import appDir from "./appDir.js";

export async function clearBuildDir() {
  const buildPath = path.join(appDir, "build");
  await fsPromises.rm(buildPath, { recursive: true, force: true });
}

export async function copyStaticFiles() {
  const staticPath = path.join(appDir, "static");
  const buildPath = path.join(appDir, "build");

  await fsPromises.cp(staticPath, buildPath, { recursive: true });
}

export async function copyStyles() {
  const stylesPath = path.join(appDir, "src/styles");
  const buildPath = path.join(appDir, "build/styles");

  await fsPromises.cp(stylesPath, buildPath, { recursive: true });
}

export async function copyScripts() {
  const scriptsPath = path.join(appDir, "src/scripts");
  const buildPath = path.join(appDir, "build/scripts");

  await fsPromises.cp(scriptsPath, buildPath, { recursive: true });
}

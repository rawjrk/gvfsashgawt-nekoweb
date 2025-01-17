import path from "node:path";
import fsPromises from "node:fs/promises";
import scanDirectory from "./scanDirectory.js";
import appDir from "./appDir.js";
import { minify } from "minify";

export async function clearBuildDir() {
  const buildPath = path.join(appDir, "build");
  await fsPromises.rm(buildPath, { recursive: true, force: true });
}

export async function copyStaticFiles() {
  const staticPath = path.join(appDir, "static");
  const buildPath = path.join(appDir, "build/static");
  await fsPromises.cp(staticPath, buildPath, { recursive: true });
}

export async function copyFaviconIco() {
  try {
    const staticFaviconPath = path.join(appDir, "static", "favicon.ico");
    const buildFaviconPath = path.join(appDir, "build", "favicon.ico");
    await fsPromises.cp(staticFaviconPath, buildFaviconPath);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.warn("File /static/favicon.ico not found");
      return;
    }
    throw err;
  }
}

export async function copyStyles() {
  const stylesPath = path.join(appDir, "src/styles");
  const buildPath = path.join(appDir, "build/styles");

  const stylesContent = await scanDirectory(stylesPath, ".css");

  for (const dirent of stylesContent) {
    const { copyFrom, copyTo } = generateCopyPath(dirent, stylesPath, buildPath);

    const textContent = await fsPromises.readFile(copyFrom, "utf-8").then(minify.css);

    const destParentDir = copyTo.slice(0, dirent.name.length * -1);
    await fsPromises.mkdir(destParentDir, { recursive: true });
    await fsPromises.writeFile(copyTo, textContent, "utf-8");
  }
}

export async function copyScripts() {
  const scriptsPath = path.join(appDir, "src/scripts");
  const buildPath = path.join(appDir, "build/scripts");

  const scriptsContent = await scanDirectory(scriptsPath, ".js");

  for (const dirent of scriptsContent) {
    const { copyFrom, copyTo } = generateCopyPath(dirent, scriptsPath, buildPath);

    const textContent = await fsPromises.readFile(copyFrom, "utf-8").then(minify.js);

    const destParentDir = copyTo.slice(0, dirent.name.length * -1);
    await fsPromises.mkdir(destParentDir, { recursive: true });
    await fsPromises.writeFile(copyTo, textContent, "utf-8");
  }
}

function generateCopyPath(dirent, srcPath, destPath) {
  const relativePath = dirent.parentPath.slice(srcPath.length);

  const copyFrom = path.join(dirent.parentPath, dirent.name);
  const copyTo = path.join(destPath, relativePath, dirent.name);

  return { copyFrom, copyTo };
}

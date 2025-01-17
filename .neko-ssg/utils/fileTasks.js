import path from "node:path";
import fsPromises from "node:fs/promises";
import scanDirectory from "./scanDirectory.js";
import appDir from "./appDir.js";
import { minify } from "minify";

export async function clearBuildDir() {
  const buildPath = path.join(appDir, "build");
  await fsPromises.rm(buildPath, { recursive: true, force: true });
}

export async function symlinkStatics() {
  await symlinkRelPath("static/favicon.ico", "build/favicon.ico");
  await symlinkRelPath("static", "build/static");
  await symlinkRelPath("src/styles", "build/styles");
  await symlinkRelPath("src/scripts", "build/scripts");
}

async function symlinkRelPath(fromRel, toRel) {
  const copyFromPath = path.join(appDir, fromRel);
  const copyToPath = path.join(appDir, toRel);

  await fsPromises.symlink(copyFromPath, copyToPath, { recursive: true, force: true });
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

export async function copyStyles({ skipMinification = false } = {}) {
  const stylesPath = path.join(appDir, "src/styles");
  const buildPath = path.join(appDir, "build/styles");

  const stylesContent = await scanDirectory(stylesPath, ".css");

  for (const dirent of stylesContent) {
    const { copyFrom, copyTo } = generateCopyPath(dirent, stylesPath, buildPath);

    let textContent = await fsPromises.readFile(copyFrom, "utf-8");
    if (!skipMinification) {
      textContent = await minify.css(textContent);
    }

    const destParentDir = copyTo.slice(0, dirent.name.length * -1);
    await fsPromises.mkdir(destParentDir, { recursive: true });
    await fsPromises.writeFile(copyTo, textContent, "utf-8");
  }
}

export async function copyScripts({ skipMinification = false } = {}) {
  const scriptsPath = path.join(appDir, "src/scripts");
  const buildPath = path.join(appDir, "build/scripts");

  const scriptsContent = await scanDirectory(scriptsPath, ".js");

  for (const dirent of scriptsContent) {
    const { copyFrom, copyTo } = generateCopyPath(dirent, scriptsPath, buildPath);

    let textContent = await fsPromises.readFile(copyFrom, "utf-8");
    if (!skipMinification) {
      textContent = await minify.js(textContent);
    }

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

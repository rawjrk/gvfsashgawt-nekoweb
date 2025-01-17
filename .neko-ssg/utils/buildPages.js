import fsPromises from "node:fs/promises";
import path from "node:path";
import ejs from "ejs";
import { minify } from "minify";
import appDir from "./appDir.js";
import scanDirectory from "./scanDirectory.js";

const pagesPath = path.join(appDir, "src/pages");

export default async function buildPages() {
  const pagesContent = await scanDirectory(pagesPath, ".ejs");

  const endpointsMap = new Map();

  for (const dirent of pagesContent) {
    const { url, compiledHtml, writeTo } = await generatePage(dirent);

    await fsPromises.mkdir(path.dirname(writeTo), { recursive: true });
    await fsPromises.writeFile(writeTo, compiledHtml, "utf-8");

    endpointsMap.set(url, writeTo);
  }

  return endpointsMap;
}

async function generatePage(dirent) {
  const renderFrom = path.join(dirent.parentPath, dirent.name);
  const url = path.relative(pagesPath, renderFrom);

  const configPath = replaceExtname(renderFrom, ".config.js");
  const { title, metadata, navigation } = await loadModule(configPath, "utf-8");

  const renderData = { title, metadata, navigation };
  const compiledHtml = await ejsRenderFile(renderFrom, renderData).then(minify.html);

  const htmlFilename = replaceExtname(dirent.name, ".html");
  const writeTo = path.join(appDir, "build", htmlFilename);

  return { url, compiledHtml, writeTo };
}

function replaceExtname(nameOrPath, extension) {
  const sliceBy = path.extname(nameOrPath).length * -1;
  return nameOrPath.slice(0, sliceBy) + extension;
}

async function loadModule(absolutePath) {
  try {
    const moduleNamespace = await import(absolutePath);
    return moduleNamespace;
  } catch (err) {
    if (err.code === "ERR_MODULE_NOT_FOUND") {
      console.error("Error on exporting config from", absolutePath);
      return {};
    }
    throw err;
  }
}

async function ejsRenderFile(filename, data, options) {
  const customOptions = {
    root: path.join(appDir, "src"),
    ...options,
  };

  return new Promise((resolve, reject) => {
    ejs.renderFile(filename, data, customOptions, (err, str) => {
      if (err) {
        reject(err);
      }
      resolve(str);
    });
  });
}

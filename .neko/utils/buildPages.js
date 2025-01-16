const fsPromises = require("node:fs/promises");
const path = require("node:path");
const ejs = require("ejs");
const appDir = require("./appDir");
const scanDirectory = require("./scanDirectory");

const pagesPath = path.join(appDir, "src/pages");

module.exports = async function buildPages() {
  const pagesContent = await scanDirectory(pagesPath, ".ejs");

  const endpointsMap = new Map();

  for (const dirent of pagesContent) {
    const { url, compiledHtml, writeTo } = await generatePage(dirent);

    await fsPromises.mkdir(path.dirname(writeTo), { recursive: true });
    await fsPromises.writeFile(writeTo, compiledHtml, "utf-8");

    endpointsMap.set(url, writeTo);
  }

  return endpointsMap;
};

async function generatePage(dirent) {
  const renderFrom = path.join(dirent.parentPath, dirent.name);
  const url = path.relative(pagesPath, renderFrom);

  const metadataPath = replaceExtname(renderFrom, ".metadata.js");
  const navigationPath = replaceExtname(renderFrom, ".navigation.js");

  const [metadata, navigation] = await Promise.all([
    loadModule(metadataPath, "utf-8"),
    loadModule(navigationPath, "utf-8"),
  ]);

  const renderData = { metadata };
  const compiledHtml = await ejsRenderFile(renderFrom, renderData); // TODO: integrate 'minifier' to reduce file sizes
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
    return moduleNamespace.default;
  } catch (err) {
    if (err.code === "ERR_MODULE_NOT_FOUND") {
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

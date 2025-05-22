/**
 * @typedef {import('./logStats.js').Stats} Stats
 */
import path from "node:path";
import fsPromises from "node:fs/promises";
import appDir from "./appDir.js"; // TODO: replace with function arguments
import scanDirectory from "./scanDirectory.js";
import { addHash, generateHash } from "./fileHash.js";
import { ejsRenderFile, generateBuildPath, loadModule } from "./buildPages.js";
import minifyHtml from "./minifiers/html.js";
import minifyCss from "./minifiers/css.js";
import minifyJs from "./minifiers/js.js";
import logStats from "./logStats.js";

/**
 * Runs build: compile EJS to HTML, copy JS/CSS and static files.
 * @param {object} options configuration object
 * @param {boolean} options.skipMinification specifies whether to skip minification step
 * @param {boolean} options.hideStats specifies whether to hide compression stats
 */
export default async function runBuild({ skipMinification = false, hideStats = false } = {}) {
  // TODO: appDir to be provided from fn args

  const srcDir = path.join(appDir, "src");
  const buildDir = path.join(appDir, "build");
  await fsPromises.rm(buildDir, { force: true, recursive: true });

  /** @type {Stats} */
  const stats = {
    html: [0, 0],
    css: [0, 0],
    js: [0, 0],
  };

  const pagesDir = path.join(srcDir, "pages");
  const pages = await scanDirectory(pagesDir, ".ejs");

  for (const template of pages) {
    const templatePath = path.join(template.parentPath, template.name);
    const configPath = templatePath.replace(/.ejs$/, ".config.js");

    const context = await loadModule(configPath);
    let html = await ejsRenderFile(templatePath, context);

    stats.html[0] += html.length; // original size

    if (!skipMinification) {
      html = await minifyHtml(html);
      stats.html[1] += html.length; // compressed size
    }

    const writeToPath = generateBuildPath({
      srcPath: templatePath.replace(/.ejs$/, ".html"),
      srcDir: pagesDir,
      buildDir,
    });
    await fsPromises.mkdir(path.dirname(writeToPath), { recursive: true });
    await fsPromises.writeFile(writeToPath, html, "utf-8");
  }

  const stylesDir = path.join(srcDir, "styles");
  const styles = await scanDirectory(stylesDir, ".css");

  for (const style of styles) {
    const stylePath = path.join(style.parentPath, style.name);
    let css = await fsPromises.readFile(stylePath, "utf-8");

    stats.css[0] += css.length; // original size

    if (!skipMinification) {
      css = await minifyCss(css);
      stats.css[1] += css.length; // compressed size
    }

    const writeToPath = generateBuildPath({
      srcPath: stylePath,
      srcDir: stylesDir,
      buildDir: path.join(buildDir, "styles"),
    });

    const styleHash = generateHash(css);
    const writeToPathWithHash = addHash(writeToPath, styleHash);

    await fsPromises.mkdir(path.dirname(writeToPathWithHash), { recursive: true });
    await fsPromises.writeFile(writeToPathWithHash, css, "utf-8");
  }

  const scriptsDir = path.join(srcDir, "scripts");
  const scripts = await scanDirectory(scriptsDir, ".js");

  for (const script of scripts) {
    const scriptPath = path.join(script.parentPath, script.name);
    let js = await fsPromises.readFile(scriptPath, "utf-8");

    stats.js[0] += js.length; // original size

    if (!skipMinification) {
      js = await minifyJs(js);
      stats.js[1] += js.length; // compressed size
    }

    const writeToPath = generateBuildPath({
      srcPath: scriptPath,
      srcDir: scriptsDir,
      buildDir: path.join(buildDir, "scripts"),
    });

    const scriptHash = generateHash(js);
    const writeToPathWithHash = addHash(writeToPath, scriptHash);

    await fsPromises.mkdir(path.dirname(writeToPathWithHash), { recursive: true });
    await fsPromises.writeFile(writeToPathWithHash, js, "utf-8");
  }

  const staticDir = path.join(appDir, "static");
  const staticFiles = await scanDirectory(staticDir);

  for (const { parentPath, name } of staticFiles) {
    const copyFrom = path.join(parentPath, name);
    const isFavicon = name === "favicon.ico";

    const copyTo = generateBuildPath({
      srcPath: copyFrom,
      srcDir: staticDir,
      buildDir: path.join(buildDir, !isFavicon ? "static" : ""),
    });

    await fsPromises.cp(copyFrom, copyTo);
  }

  if (!hideStats) {
    logStats(stats, skipMinification);
  }

  console.log("Successfully completed fresh build");
}

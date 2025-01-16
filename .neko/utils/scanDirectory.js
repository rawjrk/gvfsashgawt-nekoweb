const path = require("node:path");
const fsPromises = require("node:fs/promises");

module.exports = async function scanDirectory(dirPath, allowedExtension) {
  const dirContent = await fsPromises.readdir(dirPath, {
    recursive: true,
    withFileTypes: true,
  });

  return dirContent.filter(
    (dirent) =>
      dirent.isFile() && path.extname(dirent.name) === allowedExtension,
  );
};

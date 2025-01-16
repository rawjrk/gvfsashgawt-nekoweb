import path from "node:path";
import fsPromises from "node:fs/promises";

export default async function scanDirectory(dirPath, allowedExtension) {
  const dirContent = await fsPromises.readdir(dirPath, {
    recursive: true,
    withFileTypes: true,
  });

  return dirContent.filter(
    (dirent) =>
      dirent.isFile() && path.extname(dirent.name) === allowedExtension
  );
}

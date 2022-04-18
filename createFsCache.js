import fs from "fs/promises";
import { packageDirectory } from "pkg-dir";
import ensureDir from "./utils/ensureDir";

export default async function createFsCache(name) {
  const pkgDir = await packageDirectory();
  const fsCacheDir = `${pkgDir}/node_modules/.micache-fs`;
  const cacheDir = `${fsCacheDir}/${name}`;
  await ensureDir(fsCacheDir);
  await ensureDir(cacheDir);

  function getPath(key) {
    return `${cacheDir}/${key}`;
  }

  async function set(key, data) {
    await fs.writeFile(getPath(key), data);
  }

  async function get(key) {
    if (await has(key)) {
      return await fs.readFile(getPath(key), "utf8");
    }
  }

  async function has(key) {
    try {
      await fs.access(getPath(key));
    } catch {
      return false;
    }
    return true;
  }

  async function deleteKey(key) {
    if (await has(key)) {
      return await fs.deleteFile(getPath(key));
    }
  }

  async function cleanKeyStartsWith(keyStart, except) {
    const files = await fs.readdir(cacheDir);
    for (const file of files) {
      if (file.startsWith(keyStart) && except && key !== except) {
        deleteKey(file);
      }
    }
  }

  async function clean(){
    await fs.unlink(cacheDir)
    await ensureDir(cacheDir);
  }

  return {
    set,
    get,
    has,
    delete: deleteKey,
    clean,
    cleanKeyStartsWith,
  };
}

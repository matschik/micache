import fs from "fs/promises";

export default async function ensureDir(path) {
    try {
      await fs.access(path);
    } catch (err) {
      if (err.code === "ENOENT") {
        await fs.mkdir(path).catch(() => {});
      }
    }
  }
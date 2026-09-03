import { mkdir, writeFile, readFile, access } from "node:fs/promises";
import { dirname } from "pathe";
import { constants } from "node:fs";

export async function exists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDirForFile(filePath: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
}

export async function readSkillSource(skillPath: string): Promise<string> {
  return readFile(skillPath, "utf-8");
}

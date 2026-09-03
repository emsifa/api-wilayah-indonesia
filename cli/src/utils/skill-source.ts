import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "pathe";

export async function loadSkillContent(): Promise<string> {
  // When running via tsdown bundled dist/index.js, assets are at dist/assets/SKILL.md
  // When running via bun src/index.ts, assets are at cli/assets/SKILL.md
  // Try multiple candidates
  const candidates: string[] = [];

  // 1. dist/assets/SKILL.md relative to this file (bundled)
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    candidates.push(join(here, "assets", "SKILL.md"));
    candidates.push(join(here, "../assets/SKILL.md"));
  } catch {}

  // 2. cwd relative (cli/assets)
  candidates.push(join(process.cwd(), "cli/assets/SKILL.md"));
  candidates.push(join(process.cwd(), "assets/SKILL.md"));

  // 3. relative to project root (one level up from cli)
  candidates.push(join(process.cwd(), "../SKILL.md"));

  // 4. absolute fallback: repo root SKILL.md
  // Determine repo root by walking up? For now use known path
  candidates.push("/home/emsifa/Dev/personal/data-wilayah/SKILL.md");

  let lastErr: unknown;
  for (const p of candidates) {
    try {
      const content = await readFile(p, "utf-8");
      if (content.includes("Wilayah Indonesia")) return content;
    } catch (e) {
      lastErr = e;
    }
  }

  // Last attempt: try to read from known repo root relative to this file
  // src/utils/skill-source.ts -> ../../../SKILL.md
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const fallback = join(here, "../../../SKILL.md");
    return await readFile(fallback, "utf-8");
  } catch (e) {
    lastErr = e;
  }

  throw new Error(
    `Could not find SKILL.md source. Tried: ${candidates.join(", ")}. Last error: ${String(lastErr)}`,
  );
}

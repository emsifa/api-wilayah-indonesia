import { join } from "pathe";
import { homedir } from "node:os";

export type Agent = "claude" | "codex" | "opencode" | "antigravity" | "kiro" | "others";
export type RealAgent = Exclude<Agent, "others">;
export type Scope = "project" | "global";
export type OpencodeGlobalVariant = "xdg" | "legacy";

export const SKILL_DIR = "wilayah-indonesia";
export const SKILL_FILE = "SKILL.md";

export const ALL_AGENTS: RealAgent[] = ["claude", "codex", "opencode", "antigravity", "kiro"];

export type AgentConfig = {
  label: string;
  project: string;
  global: string;
  hint: string;
  variants?: Record<string, string>;
};

export const AGENT_REGISTRY: Record<RealAgent, AgentConfig> = {
  claude: {
    label: "Claude Code",
    project: ".claude/skills/wilayah-indonesia/SKILL.md",
    global: ".claude/skills/wilayah-indonesia/SKILL.md",
    hint: ".claude/skills/wilayah-indonesia/SKILL.md",
  },
  codex: {
    label: "Codex",
    project: ".codex/skills/wilayah-indonesia/SKILL.md",
    global: ".codex/skills/wilayah-indonesia/SKILL.md",
    hint: ".codex/skills/wilayah-indonesia/SKILL.md",
  },
  opencode: {
    label: "OpenCode",
    project: ".opencode/skills/wilayah-indonesia/SKILL.md",
    global: ".config/opencode/skills/wilayah-indonesia/SKILL.md",
    hint: ".opencode/skills/wilayah-indonesia/SKILL.md",
    variants: {
      xdg: ".config/opencode/skills/wilayah-indonesia/SKILL.md",
      legacy: ".opencode/skills/wilayah-indonesia/SKILL.md",
    },
  },
  antigravity: {
    label: "Antigravity",
    project: ".agents/skills/wilayah-indonesia/SKILL.md",
    global: ".gemini/config/skills/wilayah-indonesia/SKILL.md",
    hint: ".agents/skills/wilayah-indonesia/SKILL.md",
  },
  kiro: {
    label: "Kiro",
    project: ".kiro/skills/wilayah-indonesia/SKILL.md",
    global: ".kiro/skills/wilayah-indonesia/SKILL.md",
    hint: ".kiro/skills/wilayah-indonesia/SKILL.md",
  },
};

export function getSkillTargets(
  agents: RealAgent[],
  scope: Scope,
  opts: { cwd: string; home?: string; opencodeVariant?: OpencodeGlobalVariant },
): string[] {
  const home = opts.home ?? homedir();
  const cwd = opts.cwd;
  const variant = opts.opencodeVariant ?? "xdg";

  return agents.map((agent) => {
    const config = AGENT_REGISTRY[agent];
    if (!config) throw new Error(`Unknown agent "${agent}"`);

    if (agent === "opencode" && scope === "global") {
      const v = variant === "legacy" ? config.variants!.legacy : config.variants!.xdg;
      return join(home, v);
    }

    const rel = scope === "project" ? config.project : config.global;
    const base = scope === "project" ? cwd : home;
    return join(base, rel);
  });
}

export function parseAgents(input?: string): Agent[] {
  if (!input) return [];
  const raw = input
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const expanded: string[] = [];
  for (const r of raw) {
    if (r === "all") {
      expanded.push(...ALL_AGENTS);
    } else {
      expanded.push(r);
    }
  }

  const unique = [...new Set(expanded)];
  const valid: Agent[] = [];
  for (const u of unique) {
    if (u === "others" || (ALL_AGENTS as string[]).includes(u)) {
      valid.push(u as Agent);
    } else {
      throw new Error(
        `Unknown agent "${u}". Valid: ${[...ALL_AGENTS, "others"].join(", ")}, all`,
      );
    }
  }
  return valid;
}

import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { consola } from "consola";
import { resolve, dirname } from "pathe";
import { homedir } from "node:os";
import { writeFile, readFile } from "node:fs/promises";
import {
  ALL_AGENTS,
  AGENT_REGISTRY,
  getSkillTargets,
  parseAgents,
  type Agent,
  type RealAgent,
  type OpencodeGlobalVariant,
  type Scope,
} from "../utils/paths.js";
import { exists, ensureDirForFile } from "../utils/fs.js";
import { loadSkillContent } from "../utils/skill-source.js";

function isInteractive(args: {
  noInteractive?: boolean;
  agent?: string;
}): boolean {
  if (args.noInteractive) return false;
  if (args.agent) return false;
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

const MARKER_START = "<!-- wilayah-indonesia:start -->";
const MARKER_END = "<!-- wilayah-indonesia:end -->";

function buildAppendContent(existing: string, skillContent: string): string {
  // If already contains marker, replace block
  if (existing.includes(MARKER_START) && existing.includes(MARKER_END)) {
    const startIdx = existing.indexOf(MARKER_START);
    const endIdx = existing.indexOf(MARKER_END) + MARKER_END.length;
    const before = existing.slice(0, startIdx);
    const after = existing.slice(endIdx);
    return `${before}${MARKER_START}\n${skillContent}\n${MARKER_END}${after}`;
  }
  // Otherwise append
  const separator = existing.endsWith("\n") ? "" : "\n";
  return `${existing}${separator}\n${MARKER_START}\n${skillContent}\n${MARKER_END}\n`;
}

export const skillCommand = defineCommand({
  meta: {
    name: "skill",
    description: "Install SKILL.md for AI agents (Claude, Codex, OpenCode, Antigravity, Kiro, Others)",
  },
  args: {
    agent: {
      type: "string",
      description: "Agent: claude,codex,opencode,antigravity,kiro,others,all or comma-separated",
    },
    target: {
      type: "string",
      alias: "out",
      description: "Custom output path for \"others\" (e.g. ./.cursor/skills/wilayah-indonesia/SKILL.md)",
    },
    global: {
      type: "boolean",
      description: "Install to global (~) instead of project (./)",
      default: false,
    },
    yes: {
      type: "boolean",
      alias: "y",
      description: "Skip confirmation (auto handle overwrite/append)",
      default: false,
    },
    "dry-run": {
      type: "boolean",
      description: "Only print targets without writing files",
      default: false,
    },
    cwd: {
      type: "string",
      description: "Override project directory (default: cwd)",
    },
    "no-interactive": {
      type: "boolean",
      description: "Force non-interactive mode (for CI)",
      default: false,
    },
  },
  async run({ args }) {
    const cwd = args.cwd ? resolve(args.cwd as string) : process.cwd();
    const isDryRun = Boolean(args["dry-run"]);
    const useYes = Boolean(args.yes);
    const interactive = isInteractive({
      noInteractive: Boolean(args["no-interactive"]),
      agent: args.agent as string | undefined,
    });

    // Non-interactive without agent -> error
    if (!interactive && !args.agent) {
      consola.error(
        "Missing --agent. Non-interactive mode requires --agent <claude|codex|opencode|antigravity|kiro|others|all> (e.g. --agent claude,antigravity)",
      );
      process.exit(1);
    }

    let agents: Agent[] = [];
    let scope: Scope = args.global ? "global" : "project";
    let opencodeVariant: OpencodeGlobalVariant = "xdg";
    let customTarget: string | undefined = args.target as string | undefined;

    if (interactive) {
      p.intro(pc.bgCyan(pc.black(" wilayah skill ")));

      // 1. multiselect agents
      const selected = await p.multiselect({
        message: "Which agents do you want to install SKILL.md for? (space to select, enter to confirm)",
        options: [
          {
            value: "claude",
            label: "Claude Code",
            hint: AGENT_REGISTRY.claude.hint,
          },
          {
            value: "codex",
            label: "Codex",
            hint: AGENT_REGISTRY.codex.hint,
          },
          {
            value: "opencode",
            label: "OpenCode",
            hint: AGENT_REGISTRY.opencode.hint,
          },
          {
            value: "antigravity",
            label: "Antigravity",
            hint: AGENT_REGISTRY.antigravity.hint,
          },
          {
            value: "kiro",
            label: "Kiro",
            hint: AGENT_REGISTRY.kiro.hint,
          },
          {
            value: "others",
            label: "Others",
            hint: "Custom path (e.g. .cursor/skills/...)",
          },
        ],
        required: true,
      });

      if (p.isCancel(selected)) {
        p.cancel("Cancelled");
        process.exit(0);
      }

      agents = selected as Agent[];

      // 1b. if Others selected, prompt for custom path
      if (agents.includes("others")) {
        const targetInput = await p.text({
          message: "Enter custom output path for \"Others\"",
          placeholder: "./.cursor/skills/wilayah-indonesia/SKILL.md",
          validate(value) {
            if (!value || !value.trim()) return "Path is required";
            const v = value.trim();
            if (!v.endsWith(".md")) return "Path should end with .md (e.g. SKILL.md or AGENTS.md)";
            return undefined;
          },
        });

        if (p.isCancel(targetInput)) {
          p.cancel("Cancelled");
          process.exit(0);
        }

        customTarget = (targetInput as string).trim();
        // Resolve relative to cwd
        if (!customTarget.startsWith("/") && !customTarget.startsWith("~")) {
          customTarget = resolve(cwd, customTarget);
        } else if (customTarget.startsWith("~/")) {
          customTarget = customTarget.replace("~", homedir());
        }
      }

      // 2. scope — only if there are non-Others agents
      const realAgents = agents.filter((a) => a !== "others") as RealAgent[];
      const hasRealAgents = realAgents.length > 0;

      if (hasRealAgents) {
        const scopeSelected = await p.select({
          message: "Scope?",
          options: [
            { value: "project", label: "Project", hint: "./ (./.claude/skills/...)" },
            { value: "global", label: "Global", hint: "~ (~/.claude/skills/...)" },
          ],
        });

        if (p.isCancel(scopeSelected)) {
          p.cancel("Cancelled");
          process.exit(0);
        }

        scope = scopeSelected as Scope;

        // 3. opencode variant if needed
        if (scope === "global" && agents.includes("opencode")) {
          const variant = await p.select({
            message: "Global path for OpenCode?",
            options: [
              { value: "xdg", label: "~/.config/opencode/skills/...", hint: "XDG (Linux modern)" },
              { value: "legacy", label: "~/.opencode/skills/...", hint: "legacy" },
            ],
          });

          if (p.isCancel(variant)) {
            p.cancel("Cancelled");
            process.exit(0);
          }

          opencodeVariant = variant as OpencodeGlobalVariant;
        }
      } else {
        // Only Others — scope irrelevant, keep project as default for target resolution
        scope = "project";
      }
    } else {
      // Non-interactive
      try {
        agents = parseAgents(args.agent as string);
      } catch (e) {
        consola.error((e as Error).message);
        process.exit(1);
      }

      if (agents.length === 0) {
        consola.error("No valid agents selected");
        process.exit(1);
      }

      if (agents.includes("others") && !customTarget) {
        consola.error('Missing --target. When using --agent others, you must specify --target <path> (e.g. --target ./.cursor/skills/wilayah-indonesia/SKILL.md)');
        process.exit(1);
      }

      // Resolve customTarget if relative
      if (customTarget) {
        if (!customTarget.startsWith("/") && !customTarget.startsWith("~")) {
          customTarget = resolve(cwd, customTarget);
        } else if (customTarget.startsWith("~/")) {
          customTarget = customTarget.replace("~", homedir());
        }
      }

      scope = args.global ? "global" : "project";
    }

    // Load skill content
    let skillContent: string;
    try {
      skillContent = await loadSkillContent();
    } catch (e) {
      consola.error(`Failed to load SKILL.md: ${(e as Error).message}`);
      process.exit(1);
    }

    const realAgents = agents.filter((a) => a !== "others") as RealAgent[];
    const targets: string[] = [];

    if (realAgents.length > 0) {
      const registryTargets = getSkillTargets(realAgents, scope, {
        cwd,
        home: homedir(),
        opencodeVariant,
      });
      targets.push(...registryTargets);
    }

    if (agents.includes("others") && customTarget) {
      targets.push(customTarget);
    }

    if (targets.length === 0) {
      consola.error("No targets resolved");
      process.exit(1);
    }

    if (isDryRun) {
      consola.info(pc.dim("Dry run — no files will be written"));
      for (const t of targets) {
        consola.log(`  ${pc.cyan(t)}`);
      }
      if (interactive) p.outro(pc.green("Dry run complete"));
      return;
    }

    let installed = 0;
    let skipped = 0;

    for (const target of targets) {
      const alreadyExists = await exists(target);
      const isCustomTarget = target === customTarget;

      if (alreadyExists && !useYes) {
        if (interactive) {
          // For custom target, offer append/overwrite/skip
          if (isCustomTarget) {
            const choice = await p.select({
              message: `File already exists at ${pc.yellow(target)}. How to proceed?`,
              options: [
                { value: "append", label: "Append", hint: "Add skill content with markers" },
                { value: "overwrite", label: "Overwrite", hint: "Replace entire file" },
                { value: "skip", label: "Skip", hint: "Do not write" },
              ],
            });

            if (p.isCancel(choice) || choice === "skip") {
              consola.warn(`Skipped ${pc.dim(target)}`);
              skipped++;
              continue;
            }

            if (choice === "append") {
              const existing = await readFile(target, "utf-8");
              const newContent = buildAppendContent(existing, skillContent);
              await ensureDirForFile(target);
              await writeFile(target, newContent, "utf-8");
              consola.success(`Appended to ${pc.green(target)}`);
              installed++;
              continue;
            }

            // overwrite falls through
            if (choice === "overwrite") {
              // proceed to write
            }
          } else {
            const confirm = await p.confirm({
              message: `File already exists at ${pc.yellow(target)}. Overwrite?`,
              initialValue: false,
            });

            if (p.isCancel(confirm) || !confirm) {
              consola.warn(`Skipped ${pc.dim(target)}`);
              skipped++;
              continue;
            }
          }
        } else {
          consola.error(`File exists: ${target} — use --yes to overwrite`);
          process.exit(1);
        }
      }

      // Handle existing custom target with --yes: default to overwrite for registry, append for custom? For non-interactive with --yes, we overwrite.
      // But for custom target with --yes and existing file, we overwrite (user can choose append interactively).
      // If custom target and file exists and we are in --yes mode, we still overwrite unless user wants append via prompt.
      // For consistency, --yes means overwrite.

      // Special case: custom target with content that should be appended but --yes was set — we overwrite.
      // If we want append in CI, user can manually handle.

      await ensureDirForFile(target);
      
      // For custom target that already exists and is not overwritten via simple write, check if we should append vs overwrite?
      // In non-interactive with --yes, we overwrite. In interactive append flow we already handled.
      // So here we just write.
      
      // Edge: if custom target exists and we are in interactive append path, we already returned. So this is overwrite.
      await writeFile(target, skillContent, "utf-8");
      consola.success(`Installed ${pc.green(target)}`);
      installed++;
    }

    if (interactive) {
      if (installed > 0) {
        p.outro(
          pc.green(`✔ Installed (${installed}): ${targets.slice(0, 3).join(", ")}${targets.length > 3 ? " ..." : ""}`),
        );
      } else {
        p.outro(pc.yellow(`Skipped (${skipped}) — no files written`));
      }
    } else {
      if (installed > 0) {
        consola.info(pc.green(`Done — installed ${installed} file(s)`));
      }
    }
  },
});

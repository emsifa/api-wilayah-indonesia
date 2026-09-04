#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import { skillCommand } from "./commands/skill.js";

const main = defineCommand({
  meta: {
    name: "wilayah",
    version: "0.1.0",
    description: "CLI untuk data wilayah Indonesia — download, scaffold, skill",
  },
  subCommands: {
    skill: skillCommand,
  },
  async run(ctx) {
    // citty runs parent `run` even after subcommand — only show help when no subcommand
    const raw = (ctx as unknown as { rawArgs: string[] }).rawArgs ?? [];
    const firstNonFlag = raw.find((a: string) => !a.startsWith("-"));
    if (firstNonFlag) return;
    console.log(`
Usage: wilayah <command> [options]

Commands:
  skill    Install SKILL.md untuk AI agent (Claude, Codex, OpenCode)

Options for skill:
  --agent <claude|codex|opencode|all>  Agent (comma-separated)
  --global                             Install ke global (~)
  --yes, -y                            Skip confirm overwrite
  --dry-run                            Hanya print target
  --cwd <path>                         Override project directory
  --no-interactive                     Paksa non-interaktif
  --help, -h                           Show help

Examples:
  npx @emsifa/wilayah skill                          # interaktif (multi-select)
  npx @emsifa/wilayah skill --agent claude --yes     # non-interaktif
  npx @emsifa/wilayah skill --agent claude,opencode --global --yes
  bunx @emsifa/wilayah skill --agent codex --dry-run

Docs: https://github.com/emsifa/data-wilayah
`);
  },
});

runMain(main);

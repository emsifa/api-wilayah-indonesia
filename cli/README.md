# @emsifa/wilayah

CLI for Indonesian administrative data — download, scaffold, skill.

## Install

```bash
npx @emsifa/wilayah skill
bunx @emsifa/wilayah skill
```

Or install globally:

```bash
npm i -g @emsifa/wilayah
wilayah skill
```

## Commands

### `wilayah skill` — Install SKILL.md for AI agents

Interactive (multi-select, like `create-next-app`):

```bash
npx @emsifa/wilayah skill
```

Select agents via checklist (space to select, enter to confirm):
- Claude Code → `.claude/skills/wilayah-indonesia/SKILL.md`
- Codex → `.codex/skills/wilayah-indonesia/SKILL.md`
- OpenCode → `.opencode/skills/wilayah-indonesia/SKILL.md`
- Antigravity → `.agents/skills/wilayah-indonesia/SKILL.md` (global `~/.gemini/config/skills/...`)
- Kiro → `.kiro/skills/wilayah-indonesia/SKILL.md`
- Others → Custom path (e.g. `.cursor/skills/wilayah-indonesia/SKILL.md`, `AGENTS.md`)

Interactive flow (in English):
1. Select agents (multiple allowed, including `Others`)
2. If `Others` is selected, enter custom output path (must end with `.md`)
3. If real agents selected, select scope: Project (`./`) or Global (`~`)
4. If OpenCode + Global, choose path `~/.config/opencode` vs `~/.opencode`
5. If file exists:
   - For registry agents: confirm overwrite
   - For `Others` custom path: choose `Append` / `Overwrite` / `Skip` (append uses `<!-- wilayah-indonesia:start -->` markers, idempotent)

Non-interactive (CI):

```bash
npx @emsifa/wilayah skill --agent claude --yes
npx @emsifa/wilayah skill --agent claude,antigravity --yes
npx @emsifa/wilayah skill --agent kiro --global --yes
npx @emsifa/wilayah skill --agent all --global --yes
npx @emsifa/wilayah skill --agent others --target ./.cursor/skills/wilayah-indonesia/SKILL.md --yes
npx @emsifa/wilayah skill --agent claude,others --target ./AGENTS.md --yes
npx @emsifa/wilayah skill --agent codex --dry-run
```

Options:
- `--agent <claude|codex|opencode|antigravity|kiro|others|all>` — comma-separated
- `--target, --out <path>` — custom output path for `others`
- `--global` — install to `~` instead of `./`
- `--yes, -y` — skip confirmation (auto overwrite)
- `--dry-run` — only print targets without writing
- `--cwd <path>` — override project directory
- `--no-interactive` — force non-interactive mode
- `--help, -h` — show help

Custom path behavior:
- For `Others`, existing files give a choice of `Append` (adds skill with markers), `Overwrite` (replace file), or `Skip`.
- `Append` is idempotent — second run replaces the block between markers instead of duplicating.
- With `--yes`, `Others` overwrites (use interactive mode for append).

## Development

```bash
bun install --cwd cli
bun run --cwd cli build
node cli/dist/index.js skill --agent claude --dry-run
node cli/dist/index.js skill --agent antigravity --dry-run
node cli/dist/index.js skill --agent others --target ./.cursor/skills/wilayah-indonesia/SKILL.md --dry-run
```

## Publish

```bash
npm publish --access public --prefix cli
# or
bun publish --cwd cli
```

## Source

- Skill: `SKILL.md` at repo root
- API: `https://www.emsifa.com/api-wilayah-indonesia/v2`

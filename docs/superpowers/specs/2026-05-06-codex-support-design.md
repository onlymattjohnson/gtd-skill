# Codex CLI Support for GTD Skills

**Date:** 2026-05-06
**Status:** Approved

## Overview

Add Codex CLI support to the GTD skills plugin so both Claude Code and Codex users can use `clarify` and `plan-project`. The SKILL.md files are shared between platforms via symlinks. A cross-platform Node.js install script replaces the current manual Claude Code installation steps.

## Skill content change

`skills/clarify/SKILL.md` currently references `gtd:plan-project` (Claude Code invocation syntax). Replace with platform-neutral wording: "use the plan-project skill". No other skill content changes are needed — the skills are pure instruction-based and contain no tool calls.

## Install script (`install.js`)

A Node.js script using only built-in modules (`fs`, `path`, `os`, `readline`). No npm dependencies. Added as `npm run setup` in `package.json` (not `install`, which is a reserved npm lifecycle hook).

### Menu

```
Where would you like to install GTD skills?
  1) Claude Code only
  2) Codex only
  3) Both
  4) Cancel
```

No default — user must choose explicitly.

### Claude Code installation

1. Read `~/.claude/plugins/installed_plugins.json` (create with empty structure if missing).
2. Check for existing `gtd@local` entry:
   - Not present → insert entry.
   - Present, path matches → print "already installed", skip.
   - Present, path differs → update path (repo moved).
3. Write updated JSON back.
4. Print: `Claude Code: installed. Restart Claude Code to activate.`

The entry shape matches the existing format documented in the README:

```json
{
  "scope": "user",
  "installPath": "<absolute-path-to-repo>",
  "version": "1.0.0",
  "installedAt": "<ISO timestamp>",
  "lastUpdated": "<ISO timestamp>"
}
```

### Codex installation

1. Create `~/.agents/skills/` if it doesn't exist.
2. For each skill (`clarify`, `plan-project`):
   - Check if symlink exists and points to the correct target.
   - Correct symlink → skip.
   - Symlink exists but wrong target → delete and recreate.
   - Missing → create.
   - On Windows, use junction points (`fs.symlinkSync` with type `'junction'`).
3. Print: `Codex: installed. Skills available as $clarify and $plan-project.`

Symlink targets are absolute paths resolved at install time so the links survive CWD changes.

### Idempotency

Re-running the script is always safe. Existing correct installations are detected and skipped with a status message rather than overwritten.

## README updates

Replace the current manual "Installation" section with:

```
## Installation

Clone the repo, then run:

    node install.js

You'll be prompted to choose Claude Code, Codex, or both. Restart your CLI after installing.
```

Retain the existing manual steps below the script instructions as a fallback for environments where Node is unavailable or for advanced users.

## File changes summary

| File | Change |
|------|--------|
| `install.js` | New — cross-platform install script |
| `package.json` | Add `"setup": "node install.js"` to scripts |
| `skills/clarify/SKILL.md` | Replace `gtd:plan-project` reference with platform-neutral wording |
| `README.md` | Replace Installation section, keep manual steps as fallback |

## Out of scope

- Uninstall script (can be done manually or added later)
- Codex plugin packaging (distributable plugin manifest) — user-scoped symlinks are sufficient for personal use
- Automated tests for the install script

# GTD Skill

A plugin for Claude Code and Codex with two skills for applying GTD (Getting Things Done) to inbox processing and project planning.

## Skills

### `gtd:clarify`

Processes a raw inbox item into either a well-formed next action or a recognized project. Addresses the two most common GTD breakdowns: actions that are too vague ("work on report") and actions that are secretly projects ("sort out the garage").

**When to use:** During inbox processing — you have a captured item and need to decide what it is.

### `gtd:plan-project`

Walks through GTD's natural planning model to define a project: surfaces the purpose, pins down a specific outcome, brainstorms next actions, and identifies the single next action to capture.

**When to use:** When you have a project (identified directly or flagged by `gtd:clarify`) and need to define it.

## Installation

Clone the repo, then run:

```bash
node install.js
```

You'll be prompted to choose Claude Code, Codex, or both. Restart your CLI after installing.

You can also run it via npm:

```bash
npm run setup
```

### Manual installation (Claude Code)

**1. Clone this repo:**

```bash
git clone <repo-url> ~/code/gtd-skill
```

**2. Register the plugin** by adding a `gtd@local` entry to `~/.claude/plugins/installed_plugins.json`:

```json
{
  "version": 2,
  "plugins": {
    "gtd@local": [
      {
        "scope": "user",
        "installPath": "/Users/<your-username>/code/gtd-skill",
        "version": "1.0.0",
        "installedAt": "2026-05-06T00:00:00.000Z",
        "lastUpdated": "2026-05-06T00:00:00.000Z"
      }
    ]
  }
}
```

Replace `/Users/<your-username>/code/gtd-skill` with the actual path where you cloned the repo.

**3. Restart Claude Code.** The skills will appear in the session on next launch.

### Manual installation (Codex)

Create symlinks in `~/.agents/skills/` pointing to the skill folders in this repo:

```bash
mkdir -p ~/.agents/skills
ln -s /path/to/gtd-skill/skills/clarify ~/.agents/skills/clarify
ln -s /path/to/gtd-skill/skills/plan-project ~/.agents/skills/plan-project
```

Replace `/path/to/gtd-skill` with the actual path where you cloned the repo.

## Project structure

```
skills/
  clarify/
    SKILL.md        # gtd:clarify skill
  plan-project/
    SKILL.md        # gtd:plan-project skill
install.js          # Cross-platform install script
package.json        # Declares this repo as the "gtd" plugin
```

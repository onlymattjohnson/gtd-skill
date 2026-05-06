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

Claude Code exposes plugin skills with the plugin namespace from `.claude-plugin/plugin.json`, so these skills register as `/gtd:clarify` and `/gtd:plan-project` even if the repo folder is named something else.

You can also run it via npm:

```bash
npm run setup
```

### Manual installation (Claude Code)

**1. Clone this repo:**

```bash
git clone <repo-url> ~/code/gtd-skill
```

**2. Add the local marketplace and install the plugin:**

```bash
claude plugin marketplace add /path/to/gtd-skill
claude plugin install gtd@gtd-local --scope user
```

Replace `/path/to/gtd-skill` with the actual path where you cloned the repo.

**3. Restart Claude Code.** The skills will appear in the session on next launch.

### Manual installation (Codex)

Create symlinks in `~/.agents/skills/` pointing to the skill folders in this repo:

```bash
mkdir -p ~/.agents/skills
ln -s /path/to/gtd-skill/skills/clarify ~/.agents/skills/clarify
ln -s /path/to/gtd-skill/skills/plan-project ~/.agents/skills/plan-project
```

Replace `/path/to/gtd-skill` with the actual path where you cloned the repo.

## Usage

### Processing an inbox item

Invoke `gtd:clarify` and paste or describe the raw item:

```
/gtd:clarify "work on the presentation"
```

Claude will ask one clarifying question if the intent is ambiguous, then output either:

- A concrete next action: `**Next action:** Open the slide deck and write the agenda slide`
- A project flag: `**This is a project, not a next action.** Use the plan-project skill to define it.`

### Planning a project

Invoke `gtd:plan-project` with a project name or idea:

```
/gtd:plan-project "sort out the garage"
```

Claude walks through four steps:

1. Asks why this project matters to you
2. Proposes a specific, present-tense outcome ("Garage is cleared and items sorted into keep/donate/trash piles") and confirms it with you
3. Brainstorms 5–7 concrete physical next actions (non-sequential)
4. Asks which one to start with and outputs a single next action to capture on your list

### Combined workflow

`gtd:clarify` and `gtd:plan-project` are designed to work together. When `gtd:clarify` flags an item as a project, invoke `gtd:plan-project` on it to complete the processing loop.

## Project structure

```
skills/
  clarify/
    SKILL.md        # gtd:clarify skill
  plan-project/
    SKILL.md        # gtd:plan-project skill
.claude-plugin/
  plugin.json       # Declares the Claude Code plugin namespace as "gtd"
  marketplace.json  # Local Claude Code marketplace for supported installs
install.js          # Cross-platform install script
package.json        # npm metadata and setup script
```

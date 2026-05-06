# GTD Skill

A Claude Code plugin with two skills for applying GTD (Getting Things Done) to inbox processing and project planning.

## Skills

### `gtd:clarify`

Processes a raw inbox item into either a well-formed next action or a recognized project. Addresses the two most common GTD breakdowns: actions that are too vague ("work on report") and actions that are secretly projects ("sort out the garage").

**When to use:** During inbox processing — you have a captured item and need to decide what it is.

### `gtd:plan-project`

Walks through GTD's natural planning model to define a project: surfaces the purpose, pins down a specific outcome, brainstorms next actions, and identifies the single next action to capture.

**When to use:** When you have a project (identified directly or flagged by `gtd:clarify`) and need to define it.

## Installation

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

## Usage

### Processing an inbox item

Invoke `gtd:clarify` and paste or describe the raw item:

```
/gtd:clarify "work on the presentation"
```

Claude will ask one clarifying question if the intent is ambiguous, then output either:

- A concrete next action: `**Next action:** Open the slide deck and write the agenda slide`
- A project flag: `**This is a project, not a next action.** Use gtd:plan-project to define it.`

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
package.json        # Declares this repo as the "gtd" plugin
```

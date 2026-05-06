# GTD Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build two personal Claude Code skills — `gtd:clarify` and `gtd:plan-project` — that help process GTD inbox items and define projects using the natural planning model.

**Architecture:** The `gtd-skill` repo is structured as a local Claude Code plugin named `gtd`. Skills live in `skills/clarify/SKILL.md` and `skills/plan-project/SKILL.md`. The plugin is registered in `~/.claude/plugins/installed_plugins.json` so Claude Code discovers both skills at session start.

**Tech Stack:** Markdown skill files, Claude Code plugin system, YAML frontmatter

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `package.json` | Create | Declares this repo as the `gtd` plugin |
| `skills/clarify/SKILL.md` | Create | The `gtd:clarify` skill |
| `skills/plan-project/SKILL.md` | Create | The `gtd:plan-project` skill |
| `~/.claude/plugins/installed_plugins.json` | Modify | Registers the local plugin so Claude Code loads it |

---

## Task 1: Create package.json

**Files:**
- Create: `package.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "gtd",
  "version": "1.0.0",
  "description": "Personal GTD skills for Claude Code"
}
```

- [ ] **Step 2: Commit**

```bash
git add package.json
git commit -m "feat: add package.json to declare gtd plugin"
```

---

## Task 2: Create skills/clarify/SKILL.md

**Files:**
- Create: `skills/clarify/SKILL.md`

- [ ] **Step 1: Create the skill file**

```markdown
---
name: clarify
description: Use when processing a GTD inbox item and need to determine whether it is a well-formed next action or a project that requires natural planning.
---

# GTD Clarify

Process one inbox item at a time into either a concrete next action or a named project.

## Step 1: Clarifying Question (only if needed)

If the item's intent is ambiguous, ask ONE question to understand what the person actually wants to accomplish. If intent is clear, skip directly to Step 2.

Never ask more than one question.

## Step 2: Action or Project?

**Next action:** completable in one sitting, no prerequisite step needed first.

**Project:** requires more than one sequential step, or depends on something that doesn't yet exist.

## Step 3: Output

### If next action

> **Next action:** [physical verb] + [specific what] + [where/who/context if relevant]

Physical verbs: call, email, open, write, print, buy, schedule, search, text, read, fill out, sign, book, draft, look up, send, go to

"Decide" and "think about" are not physical verbs — push toward the physical step that makes the decision happen.

If you significantly rewrote the original, add one sentence explaining why (too vague or too large for one sitting).

### If project

> **This is a project, not a next action.**
> **Project outcome:** [present-tense completed state]
> Use `gtd:plan-project` to define next actions for this project.

## Rules

- One output only — never give both
- One sequential dependency makes it a project even if the steps seem small
- Keep the next action to one sentence
```

- [ ] **Step 2: Verify the skill against design criteria**

Read through the skill and confirm each rule from the spec is present:
- [ ] Starts with a clarifying question only when needed
- [ ] Distinguishes next action vs. project by "one sitting + no prerequisites"
- [ ] Next action output uses a physical verb
- [ ] Project output names the outcome and references `gtd:plan-project`
- [ ] Exactly one output — not both
- [ ] Description says only when to use, not how it works

- [ ] **Step 3: Commit**

```bash
git add skills/clarify/SKILL.md
git commit -m "feat: add gtd:clarify skill"
```

---

## Task 3: Create skills/plan-project/SKILL.md

**Files:**
- Create: `skills/plan-project/SKILL.md`

- [ ] **Step 1: Create the skill file**

```markdown
---
name: plan-project
description: Use when you have a GTD project and need to clarify its outcome and brainstorm next actions. Also use when gtd:clarify flags an item as a project.
---

# GTD Plan Project

Walk through the natural planning model one step at a time. Never combine steps or skip ahead.

## Step 1: Surface the Why

Ask exactly this:

> "What's the purpose of this project — why does it matter to you?"

Wait for the answer before continuing.

## Step 2: Propose the Project Outcome

Write a specific, present-tense statement of what done looks like.

Rules:
- Completed state, not an activity
- Specific enough to know when achieved
- No -ing verbs at the start ("organizing the files" → "files are organized by category")

Format:
> **Project outcome:** [present-tense completed state]

Then ask: "Does this capture what done looks like, or would you adjust it?"

Wait for confirmation or a correction before continuing.

## Step 3: Brainstorm Next Actions

Generate 5–7 concrete physical actions that could move this project forward. Tell the user explicitly that the order does not matter — this is a brainstorm, not a plan.

Rules:
- Each action starts with a physical verb
- Each is completable in one sitting
- No action in the list depends on another action in the list

Format:
> **Possible next actions (order doesn't matter):**
> - [action]
> - [action]
> ...

## Step 4: Identify the Single Next Action

Ask: "Which of these feels like the right first move, or is there a different action you'd start with?"

Once they choose or suggest one, confirm:

> **Capture this next action:** [final next action]

This is the one to put on their action list. Output exactly one next action — not a task list.
```

- [ ] **Step 2: Verify the skill against design criteria**

Read through the skill and confirm each rule from the spec is present:
- [ ] Step 1 asks about purpose/why before anything else
- [ ] Step 2 proposes a present-tense completed-state outcome and waits for confirmation
- [ ] Step 3 brainstorm is explicitly non-sequential (tells user order doesn't matter)
- [ ] Step 3 generates 5-7 actions with physical verbs
- [ ] Step 4 identifies exactly one next action to capture
- [ ] Description says only when to use, not how it works

- [ ] **Step 3: Commit**

```bash
git add skills/plan-project/SKILL.md
git commit -m "feat: add gtd:plan-project skill"
```

---

## Task 4: Register the Plugin

**Files:**
- Modify: `~/.claude/plugins/installed_plugins.json`

- [ ] **Step 1: Read the current installed_plugins.json**

```bash
cat ~/.claude/plugins/installed_plugins.json
```

- [ ] **Step 2: Add the gtd plugin entry**

Add `"gtd@local"` to the `plugins` object. The full file should look like:

```json
{
  "version": 2,
  "plugins": {
    "superpowers@claude-plugins-official": [
      {
        "scope": "user",
        "installPath": "/Users/triz/.claude/plugins/cache/claude-plugins-official/superpowers/5.1.0",
        "version": "5.1.0",
        "installedAt": "2026-05-05T23:50:16.364Z",
        "lastUpdated": "2026-05-05T23:50:16.364Z",
        "gitCommitSha": "f2cbfbefebbfef77321e4c9abc9e949826bea9d7"
      }
    ],
    "gtd@local": [
      {
        "scope": "user",
        "installPath": "/Users/triz/code/gtd-skill",
        "version": "1.0.0",
        "installedAt": "2026-05-06T00:00:00.000Z",
        "lastUpdated": "2026-05-06T00:00:00.000Z"
      }
    ]
  }
}
```

Keep the existing `superpowers@claude-plugins-official` entry exactly as-is — only add the new `gtd@local` block.

- [ ] **Step 3: Verify the JSON is valid**

```bash
cat ~/.claude/plugins/installed_plugins.json | python3 -m json.tool > /dev/null && echo "JSON valid" || echo "JSON invalid — fix before continuing"
```

Expected output: `JSON valid`

---

## Task 5: Verify Both Skills Load

- [ ] **Step 1: Start a new Claude Code session**

Close and reopen Claude Code (or start a new session). The session-start hook reads `installed_plugins.json` and loads skill metadata.

- [ ] **Step 2: Confirm skills appear in the session reminder**

In the new session, the system reminder should list:
- `gtd:clarify`
- `gtd:plan-project`

If they don't appear, check:
1. `installed_plugins.json` is valid JSON (run the python3 check from Task 4 Step 3)
2. `installPath` points to the correct absolute path
3. `skills/clarify/SKILL.md` and `skills/plan-project/SKILL.md` exist
4. Each SKILL.md has valid frontmatter with `name` and `description` fields

- [ ] **Step 3: Test gtd:clarify with a vague item**

Invoke the skill with a vague inbox item:

```
/gtd:clarify "work on the presentation"
```

Expected behavior: Claude asks one clarifying question OR immediately proposes a concrete next action like "Open PowerPoint and draft the title slide for the Q2 review presentation."

- [ ] **Step 4: Test gtd:clarify with a project-sized item**

```
/gtd:clarify "sort out the garage"
```

Expected behavior: Claude flags it as a project, proposes an outcome ("Garage is cleared and items sorted into keep/donate/trash piles"), and suggests invoking `gtd:plan-project`.

- [ ] **Step 5: Test gtd:plan-project**

```
/gtd:plan-project "sort out the garage"
```

Expected behavior: Claude asks why it matters, proposes a present-tense outcome, waits for confirmation, brainstorms 5-7 non-sequential physical actions, then asks which one to start with and outputs exactly one next action.

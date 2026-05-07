# GTD Clarify Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `gtd:clarify` from a one-shot classifier into a guided, educational GTD inbox processing walkthrough that handles all paths (trash, someday/maybe, reference, next action, project) and teaches the user the framework as it goes.

**Architecture:** Single file update — `skills/clarify/SKILL.md`. The skill becomes a step-by-step guide: it shows reasoning at each fork, handles all non-actionable paths, and for projects stays engaged to propose outcome and first next action rather than deflecting to `gtd:plan-project`.

**Tech Stack:** Markdown skill file, Claude Code plugin system, YAML frontmatter

**Spec:** `docs/superpowers/specs/2026-05-06-clarify-redesign.md`

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `skills/clarify/SKILL.md` | Modify | The redesigned clarify skill |

---

## Task 1: Update skills/clarify/SKILL.md

**Files:**
- Modify: `skills/clarify/SKILL.md`

- [ ] **Step 1: Replace the file content**

Write the following as the complete new content of `skills/clarify/SKILL.md`:

```markdown
---
name: clarify
description: "Explicit invocation only: gtd:clarify, or a direct request for the GTD clarify skill with an inbox item."
---

# GTD Clarify

Walk the person through processing one inbox item using the GTD clarify flowchart. Be a guide, not a classifier — show your reasoning at each step so they learn the framework. Propose specific outputs and invite refinement rather than asking open-ended questions.

## Step 1: Understand the Item

Restate the item in one plain sentence. If the intent is genuinely unclear, ask ONE question before proceeding. Skip the question if intent is clear.

## Step 2: Is It Actionable?

**Actionable** means: someone could take a physical step on this right now and it would move forward.
**Not actionable** means: it's information to keep, an idea for later, or something to discard.

State your read and the brief reason why. Then continue — don't wait for confirmation unless it's genuinely ambiguous.

## Step 3A: Non-Actionable Paths

Pick one bucket and explain why in one sentence:

**Trash** — Not needed now or later; nothing lost by discarding.
> **Trash:** [reason]

**Someday/Maybe** — Might want to do it, but not committing now. Revisit at weekly review.
> **Someday/Maybe:** [what it is] — add to your someday/maybe list

**Reference** — No action needed, but worth keeping as information.
> **Reference:** [what it is] — file where you can retrieve it later

## Step 3B: Actionable — Next Action or Project?

Ask yourself: what is the very next physical step someone could take on this right now?

State what that step would be. Then assess:

**Next action:** That one step gets it done — no prerequisite step needed first, no intermediate artifact to create first.

**Project:** Getting to done requires more than one sequential step, OR the next action isn't yet clear without first figuring something out or producing something that doesn't yet exist.

If it's a project: state specifically what makes it multi-step (name the dependency or missing prerequisite). Then continue to Step 4.

If it's a next action: go to Step 5.

## Step 4: Project — Outcome and First Next Action

Work through two things in order:

**Outcome:** What does "done" look like in present-tense completed state?

Propose one based on what you understand:
> **Project:** [name] — [present-tense completed state]

Ask: "Does that capture what done looks like, or would you change it?"

Wait for confirmation or a correction before continuing.

**First next action:** The very next physical step to move this project forward — something doable right now without waiting on anything.

Propose one:
> **First next action:** [physical verb] + [specific what] + [context if relevant]

Ask: "Does that feel like the right first move, or is there something that needs to happen earlier?"

## Step 5: Next Action — Refine and Output

Verify:
- Starts with a physical verb (call, email, open, write, buy, schedule, go to — not "think about" or "decide")
- Specific enough to act on without stopping to figure anything out

Output:
> **Next action:** [physical verb] + [specific what] + [context if relevant]

If you significantly rewrote the original, add one sentence explaining why.

## Rules

- Show brief reasoning at each fork — the goal is for the person to understand why each item landed where it did
- Propose specific outputs — draft something concrete and invite refinement, don't ask open-ended questions
- For projects, always continue through to outcome and first next action — never just say "use plan-project"
- One output per path — never give both next action and project
- Keep all outputs to one sentence
```

- [ ] **Step 2: Commit**

```bash
git add skills/clarify/SKILL.md
git commit -m "feat: redesign gtd:clarify as guided GTD inbox processing walkthrough"
```

---

## Task 2: Verify Against Design Criteria

**Files:**
- Read: `skills/clarify/SKILL.md`

- [ ] **Step 1: Check all design requirements are present**

Read the updated skill and confirm each item below. If any item fails, fix the skill file before continuing.

- [ ] Step 2 explains what "actionable" means and states a read + reason before continuing
- [ ] Non-actionable paths present: trash, someday/maybe, reference (Step 3A)
- [ ] Each non-actionable path has a quoted verdict format with reason
- [ ] Step 3B names the specific dependency or missing prerequisite when identifying a project — not just "this is a project"
- [ ] Step 4 proposes a present-tense outcome and waits for confirmation before proposing the first next action
- [ ] Step 4 proposes a first next action and invites refinement — does not say "use plan-project"
- [ ] Step 5 checks for physical verb and specificity before outputting
- [ ] Rules section explicitly prohibits deflecting to plan-project

---

## Task 3: Behavioral Tests

Reload the plugin first, then run each test in a Claude Code session and verify the expected behavior. The skill must not be invoked with the Skill tool for these tests — call it directly as you would in normal use.

- [ ] **Step 1: Reload the plugin**

```
/reload-plugins
```

- [ ] **Step 2: Test — project with multiple sub-tasks**

Invoke:
```
/gtd:clarify "gutter clean and pull off ivy"
```

Expected behavior:
- Restates the item
- Identifies as actionable
- Identifies as a project and states the specific reason (gutters and ivy are separate jobs; likely need to hire someone or gather supplies before either can start)
- Proposes a present-tense outcome such as "Gutters are cleaned and ivy is removed from the fence"
- Asks if that captures what done looks like
- After confirmation, proposes a first next action with a physical verb such as "Search for local gutter cleaning services and get a quote"
- Asks if that's the right first move

- [ ] **Step 3: Test — clear next action**

Invoke:
```
/gtd:clarify "call dentist to schedule my cleaning"
```

Expected behavior:
- Identifies as actionable, no clarification needed
- Identifies as a next action — one step, no prerequisites
- Outputs: **Next action:** Call dentist to schedule your annual cleaning
- Does not ask unnecessary questions

- [ ] **Step 4: Test — someday/maybe**

Invoke:
```
/gtd:clarify "learn to make sourdough bread someday"
```

Expected behavior:
- Identifies as not actionable — "someday" signals no current commitment
- Outputs: **Someday/Maybe:** Learn to make sourdough bread — add to your someday/maybe list

- [ ] **Step 5: Test — reference**

Invoke:
```
/gtd:clarify "the wifi password at the cabin is Guest123"
```

Expected behavior:
- Identifies as not actionable — this is information, not a task
- Outputs: **Reference:** Cabin wifi password (Guest123) — file in your notes or password manager

- [ ] **Step 6: Test — ambiguous item**

Invoke:
```
/gtd:clarify "deal with the thing from work"
```

Expected behavior:
- Asks ONE clarifying question before proceeding — e.g., "What is the thing from work — is it an email, a request from someone, or something else?"
- Does not guess or proceed without understanding the item
- Does not ask more than one question

- [ ] **Step 7: Commit test results**

If any test revealed a problem and you fixed the skill:

```bash
git add skills/clarify/SKILL.md
git commit -m "fix: adjust gtd:clarify based on behavioral test results"
```

If all tests passed without changes, no commit needed.

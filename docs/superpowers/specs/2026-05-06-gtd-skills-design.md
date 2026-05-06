# GTD Skills Design

**Date:** 2026-05-06  
**Status:** Approved

## Problem Statement

The user struggles with three specific GTD breakdowns during capture/processing:

1. Writing next actions that are too vague (e.g., "work on report" instead of "open doc and write intro paragraph")
2. Writing actions that are secretly projects — too big to do in one sitting
3. Defining projects with a clear outcome and brainstorming real next actions from them (natural planning model)

## Solution: Two Skills

### Skill 1: `gtd:clarify`

**Purpose:** Process a raw inbox item into either a well-formed next action or a recognized project.

**Trigger:** User is doing inbox processing (capture/clarify phase of GTD).

**Flow:**

1. User invokes skill and provides a raw inbox item.
2. Claude asks one clarifying question if intent is ambiguous — skips the question if intent is clear.
3. Claude outputs one of two things:
   - **Next action:** A single, concrete, physical step starting with an action verb. If the original was significantly rewritten, a brief note explains why (too vague or too big).
   - **Project flag:** States "This is a project, not an action," names the project outcome, and suggests invoking `gtd:plan-project`.

**Rules the skill enforces:**

- Next actions must start with a physical verb: call, email, open, write, print, buy, schedule, etc.
- Next actions must be completable in one sitting with no prerequisite step.
- If completing the item requires more than one sequential step that doesn't exist yet, it is a project.

---

### Skill 2: `gtd:plan-project`

**Purpose:** Define a project using GTD's natural planning model so it can drive action.

**Trigger:** User has a project (identified directly or flagged by `gtd:clarify`) and needs to define it.

**Flow:**

1. User invokes skill with a project name or rough idea.
2. Claude asks one question to surface the **why** — purpose and values behind the project.
3. Claude proposes a **project outcome**: a specific, present-tense statement of what done looks like (e.g., "Home office is cleared, furniture arranged, and supplies organized by category").
4. User confirms or refines the outcome.
5. Claude brainstorms **5-7 potential next actions** — concrete physical steps that could move the project forward, non-sequential (GTD brainstorm, not an ordered plan).
6. User selects or refines the relevant actions; Claude identifies the **single next action** to capture on the action list.

**Rules the skill enforces:**

- Project outcome describes a completed state, not an activity ("office is organized" not "work on office").
- Brainstorm is non-linear — no step depends on another at this stage.
- Output is exactly one next action to capture, not a task list.

---

## Relationship Between Skills

`gtd:clarify` is the entry point during processing. When it detects a project, it hands off to `gtd:plan-project`. The two skills can also be used independently — `gtd:plan-project` is valid as a standalone planning tool.

## Out of Scope

- Weekly review workflows
- Context/list assignment (which list the action goes on)
- Project tracking or task management integration
- Sequencing or ordering of project steps (GTD brainstorm is intentionally non-linear)

## Success Criteria

- `gtd:clarify` reliably distinguishes vague actions from projects and produces correctly formed next actions
- `gtd:plan-project` reliably surfaces a clear outcome statement and a usable brainstorm
- Both skills use a conversational mix: one clarifying question when needed, then concrete output

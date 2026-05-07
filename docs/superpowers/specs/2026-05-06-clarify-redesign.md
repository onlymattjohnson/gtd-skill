# GTD Clarify Redesign Design

**Date:** 2026-05-06
**Status:** Approved

## Problem Statement

The current `gtd:clarify` skill has three gaps:

1. **Classifier, not a guide** — It categorizes inbox items and exits without explaining why. The user never learns the GTD decision framework — they just get an answer.

2. **Missing non-actionable paths** — GTD clarify handles five outcomes: next action, project, trash, someday/maybe, and reference. The current skill only handles next action and project.

3. **Projects get deflected, not processed** — When the skill identifies a project it says "use plan-project" and stops. The clarify step should stay engaged: explain why it's a project, propose the outcome, and propose the first next action.

## Solution: Redesigned gtd:clarify

The skill becomes a guided, educational walkthrough of the GTD clarify flowchart. It shows its reasoning at each decision point so the user learns the framework over time. It proposes specific outputs and invites refinement rather than asking open-ended questions.

### Flowchart

```
Inbox item
  ↓
Understand it (ask one question only if genuinely ambiguous)
  ↓
Is it actionable?
  No →
    Trash: not needed now or later
    Someday/Maybe: might do it, not committing now
    Reference: no action needed, but keep the info
  Yes →
    What's the very next physical step?
    One step, nothing needed first → Next Action → refine and output
    Multiple steps or prerequisite missing → Project
      → explain specifically why it's a project
      → propose outcome (present-tense completed state), wait for confirmation
      → propose first next action, invite refinement
```

### Key Behavioral Requirements

1. **Show reasoning at each fork** — brief, not lecturing. "This is a project because X needs to happen before Y can happen."

2. **Propose, don't interrogate** — draft specific outputs and invite refinement. Never ask an open-ended question when you can propose something concrete.

3. **Handle all non-actionable paths** — trash, someday/maybe, reference. Each gets a one-line verdict with reason.

4. **Projects: stay engaged** — when something is a project, explain specifically why, then work through outcome and first next action before stopping. Never just say "use plan-project."

5. **One output per path** — never give both next action and project output.

### Success Criteria

- "Gutter clean and pull off ivy" → identified as project with specific reason, outcome proposed and confirmed, first next action proposed
- "Call dentist to schedule cleaning" → next action output directly, no unnecessary conversation
- "Learn to make sourdough someday" → someday/maybe with reason
- "Wifi password is Guest123" → reference with filing suggestion
- "Deal with the thing from work" → one clarifying question asked before proceeding
- User should be able to understand WHY each item landed where it did

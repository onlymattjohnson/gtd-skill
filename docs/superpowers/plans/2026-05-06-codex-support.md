# Codex CLI Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Codex CLI support so both Claude Code and Codex users can install and use the GTD skills via a single cross-platform Node.js install script.

**Architecture:** A Node.js script (`install.js`) presents a menu and handles installation for Claude Code (upserts `~/.claude/plugins/installed_plugins.json`) and/or Codex (creates symlinks in `~/.agents/skills/`). The existing SKILL.md files are shared between platforms — no copies, just symlinks. One line in `skills/clarify/SKILL.md` is reworded to remove a Claude Code–specific invocation reference.

**Tech Stack:** Node.js built-ins only (`fs`, `path`, `os`, `readline`). No npm dependencies added.

---

### Task 1: Make cross-skill reference platform-neutral

**Files:**
- Modify: `skills/clarify/SKILL.md`

- [ ] **Step 1: Edit the cross-skill reference**

In `skills/clarify/SKILL.md`, find the line:

```
> Use `gtd:plan-project` to define next actions for this project.
```

Replace with:

```
> Use the plan-project skill to define next actions for this project.
```

- [ ] **Step 2: Verify the change looks right**

Run:
```bash
grep -n "plan-project" skills/clarify/SKILL.md
```

Expected output — only one match, no backtick invocation syntax:
```
39:> Use the plan-project skill to define next actions for this project.
```

- [ ] **Step 3: Commit**

```bash
git add skills/clarify/SKILL.md
git commit -m "fix: make cross-skill reference platform-neutral"
```

---

### Task 2: Write the install script

**Files:**
- Create: `install.js`

- [ ] **Step 1: Create `install.js` with the full implementation**

```js
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const REPO_ROOT = __dirname;
const SKILLS = ['clarify', 'plan-project'];

const CLAUDE_PLUGINS_FILE = path.join(
  os.homedir(), '.claude', 'plugins', 'installed_plugins.json'
);
const PLUGIN_KEY = 'gtd@local';
const AGENTS_SKILLS_DIR = path.join(os.homedir(), '.agents', 'skills');

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function installClaudeCode() {
  const pluginsDir = path.dirname(CLAUDE_PLUGINS_FILE);
  if (!fs.existsSync(pluginsDir)) {
    fs.mkdirSync(pluginsDir, { recursive: true });
  }

  let data = { version: 2, plugins: {} };
  if (fs.existsSync(CLAUDE_PLUGINS_FILE)) {
    try {
      data = JSON.parse(fs.readFileSync(CLAUDE_PLUGINS_FILE, 'utf8'));
    } catch {
      // malformed JSON — start fresh
    }
  }
  if (!data.plugins) data.plugins = {};

  const now = new Date().toISOString();
  const entries = data.plugins[PLUGIN_KEY];
  const existing = Array.isArray(entries) ? entries[0] : null;

  if (existing) {
    if (existing.installPath === REPO_ROOT) {
      console.log('Claude Code: already installed — skipping.');
      return;
    }
    existing.installPath = REPO_ROOT;
    existing.lastUpdated = now;
    console.log('Claude Code: updated install path (repo moved).');
  } else {
    data.plugins[PLUGIN_KEY] = [{
      scope: 'user',
      installPath: REPO_ROOT,
      version: '1.0.0',
      installedAt: now,
      lastUpdated: now,
    }];
    console.log('Claude Code: installed.');
  }

  fs.writeFileSync(CLAUDE_PLUGINS_FILE, JSON.stringify(data, null, 2) + '\n');
  console.log('  → Restart Claude Code to activate.');
}

function installCodex() {
  if (!fs.existsSync(AGENTS_SKILLS_DIR)) {
    fs.mkdirSync(AGENTS_SKILLS_DIR, { recursive: true });
  }

  const isWindows = process.platform === 'win32';
  const symlinkType = isWindows ? 'junction' : 'dir';

  for (const skill of SKILLS) {
    const target = path.join(REPO_ROOT, 'skills', skill);
    const linkPath = path.join(AGENTS_SKILLS_DIR, skill);

    if (fs.existsSync(linkPath)) {
      let existingTarget = null;
      try {
        existingTarget = fs.readlinkSync(linkPath);
      } catch {
        // not a symlink/junction — remove and recreate
      }
      if (existingTarget === target) {
        console.log(`Codex: $${skill} already installed — skipping.`);
        continue;
      }
      fs.rmSync(linkPath, { recursive: true, force: true });
    }

    fs.symlinkSync(target, linkPath, symlinkType);
    console.log(`Codex: $${skill} installed.`);
  }

  console.log('  → Skills available as $clarify and $plan-project.');
}

async function main() {
  console.log('\nGTD Skills Installer\n');
  console.log('Where would you like to install GTD skills?');
  console.log('  1) Claude Code only');
  console.log('  2) Codex only');
  console.log('  3) Both');
  console.log('  4) Cancel\n');

  const choice = await ask('Enter choice (1-4): ');

  switch (choice) {
    case '1': installClaudeCode(); break;
    case '2': installCodex(); break;
    case '3': installClaudeCode(); installCodex(); break;
    case '4': console.log('Cancelled.'); break;
    default:
      console.error('Invalid choice. Run the script again and enter 1, 2, 3, or 4.');
      process.exit(1);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
```

- [ ] **Step 2: Smoke-test the script (Cancel path)**

Run:
```bash
echo "4" | node install.js
```

Expected output:
```
GTD Skills Installer

Where would you like to install GTD skills?
  1) Claude Code only
  2) Codex only
  3) Both
  4) Cancel

Enter choice (1-4): Cancelled.
```

- [ ] **Step 3: Smoke-test the Codex install path**

Run:
```bash
echo "2" | node install.js
```

Expected: prints `Codex: $clarify installed.` and `Codex: $plan-project installed.`

Verify symlinks were created:
```bash
ls -la ~/.agents/skills/
```

Expected: two symlinks pointing into this repo's `skills/` directory.

Run again to verify idempotency:
```bash
echo "2" | node install.js
```

Expected: prints `already installed — skipping.` for both skills.

- [ ] **Step 4: Commit**

```bash
git add install.js
git commit -m "feat: add cross-platform install script with platform menu"
```

---

### Task 3: Wire install script into package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add the setup script**

Current `package.json`:
```json
{
  "name": "gtd",
  "version": "1.0.0",
  "description": "Personal GTD skills for Claude Code"
}
```

Updated `package.json`:
```json
{
  "name": "gtd",
  "version": "1.0.0",
  "description": "Personal GTD skills for Claude Code and Codex",
  "scripts": {
    "setup": "node install.js"
  }
}
```

- [ ] **Step 2: Verify it runs via npm**

Run:
```bash
echo "4" | npm run setup
```

Expected: npm prints `> node install.js`, then the menu appears, then `Cancelled.`

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add npm run setup for install script"
```

---

### Task 4: Update README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace the Installation section**

Find the existing `## Installation` section (lines starting at `## Installation` through the end of the manual step block). Replace it with:

```markdown
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
```

- [ ] **Step 2: Also update the description in the intro paragraph**

Find:
```
A Claude Code plugin with two skills for applying GTD (Getting Things Done) to inbox processing and project planning.
```

Replace with:
```
A plugin for Claude Code and Codex with two skills for applying GTD (Getting Things Done) to inbox processing and project planning.
```

- [ ] **Step 3: Verify the README renders correctly**

Run:
```bash
cat README.md
```

Confirm: `## Installation` appears once, the `node install.js` block comes first, manual sections follow under `###` headings.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: update README for Codex support and install script"
```

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
      console.warn('Warning: installed_plugins.json could not be parsed — writing fresh file.');
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

    if (!fs.existsSync(target)) {
      console.error(`Codex: skill source not found at ${target} — skipping $${skill}.`);
      continue;
    }

    if (fs.existsSync(linkPath)) {
      let existingTarget = null;
      try {
        existingTarget = fs.readlinkSync(linkPath);
      } catch {
        console.warn(`Codex: $${skill} — path exists and is not a symlink; overwriting.`);
      }
      if (existingTarget === target) {
        console.log(`Codex: \$${skill} already installed — skipping.`);
        continue;
      }
      fs.rmSync(linkPath, { recursive: true, force: true });
    }

    try {
      fs.symlinkSync(target, linkPath, symlinkType);
      console.log(`Codex: \$${skill} installed.`);
    } catch (err) {
      console.error(`Codex: failed to create link for \$${skill} — ${err.message}`);
      if (process.platform === 'win32') {
        console.error('  On Windows, try running with Administrator privileges or enable Developer Mode.');
      }
    }
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

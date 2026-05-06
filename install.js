#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');
const { spawnSync } = require('child_process');

const REPO_ROOT = __dirname;
const SKILLS = ['clarify', 'plan-project'];

const CLAUDE_PLUGIN_ID = 'gtd@gtd-local';
const AGENTS_SKILLS_DIR = path.join(os.homedir(), '.agents', 'skills');
const CLAUDE_MANIFEST_FILE = path.join(REPO_ROOT, '.claude-plugin', 'plugin.json');
const CLAUDE_MARKETPLACE_FILE = path.join(REPO_ROOT, '.claude-plugin', 'marketplace.json');

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function runClaude(args) {
  const result = spawnSync('claude', args, { stdio: 'inherit' });

  if (result.error && result.error.code === 'ENOENT') {
    console.error('Claude Code: claude CLI not found in PATH.');
    process.exit(1);
  }
  if (result.error) {
    console.error(`Claude Code: failed to run claude ${args.join(' ')} — ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function installClaudeCode() {
  if (!fs.existsSync(CLAUDE_MANIFEST_FILE)) {
    console.error(`Claude Code: plugin manifest not found at ${CLAUDE_MANIFEST_FILE}.`);
    process.exit(1);
  }
  if (!fs.existsSync(CLAUDE_MARKETPLACE_FILE)) {
    console.error(`Claude Code: marketplace manifest not found at ${CLAUDE_MARKETPLACE_FILE}.`);
    process.exit(1);
  }

  runClaude(['plugin', 'marketplace', 'add', REPO_ROOT]);
  runClaude(['plugin', 'install', CLAUDE_PLUGIN_ID, '--scope', 'user']);
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
      console.error(`Codex: skill source not found at ${target} — skipping \$${skill}.`);
      continue;
    }

    if (fs.existsSync(linkPath)) {
      let existingTarget = null;
      try {
        existingTarget = fs.readlinkSync(linkPath);
      } catch {
        console.warn(`Codex: \$${skill} — path exists and is not a symlink; overwriting.`);
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

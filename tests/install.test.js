const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');

test('Claude Code install can run a PowerShell claude shim on Windows', { skip: process.platform !== 'win32' }, () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gtd-installer-'));
  test.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));

  const logFile = path.join(tempDir, 'claude-args.log');
  const shimPath = path.join(tempDir, 'claude.ps1');

  fs.writeFileSync(
    shimPath,
    [
      '$ErrorActionPreference = "Stop"',
      `Add-Content -LiteralPath ${JSON.stringify(logFile)} -Value ($args -join " ")`,
      'exit 0',
      '',
    ].join('\n')
  );

  const result = spawnSync(process.execPath, ['install.js'], {
    cwd: repoRoot,
    input: '1\n',
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: `${tempDir}${path.delimiter}${process.env.PATH || ''}`,
    },
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(
    fs.readFileSync(logFile, 'utf8').trim().split(/\r?\n/).join('\n'),
    [
      `plugin marketplace add ${repoRoot}`,
      'plugin install gtd@gtd-local --scope user',
    ].join('\n')
  );
});

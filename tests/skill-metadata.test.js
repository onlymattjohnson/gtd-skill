const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function readFrontmatter(skillPath) {
  const content = fs.readFileSync(skillPath, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(match, `${skillPath} has frontmatter`);

  return Object.fromEntries(
    match[1]
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(':');
        assert.notEqual(separator, -1, `${line} is a key-value line`);
        return [
          line.slice(0, separator).trim(),
          line.slice(separator + 1).trim(),
        ];
      })
  );
}

function readFrontmatterLines(skillPath) {
  const content = fs.readFileSync(skillPath, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(match, `${skillPath} has frontmatter`);

  return match[1].split(/\r?\n/).filter(Boolean);
}

test('GTD skill descriptions require explicit invocation', () => {
  const skillDirs = ['clarify', 'plan-project'];

  for (const skillDir of skillDirs) {
    const skillPath = path.join(repoRoot, 'skills', skillDir, 'SKILL.md');
    const frontmatter = readFrontmatter(skillPath);

    assert.match(frontmatter.description, /explicit/i);
    assert.doesNotMatch(frontmatter.description, /\bUse when\b/i);
    assert.doesNotMatch(frontmatter.description, /\bAlso use when\b/i);
  }
});

test('GTD skill frontmatter uses YAML-safe scalar values', () => {
  const skillDirs = ['clarify', 'plan-project'];

  for (const skillDir of skillDirs) {
    const skillPath = path.join(repoRoot, 'skills', skillDir, 'SKILL.md');

    for (const line of readFrontmatterLines(skillPath)) {
      const separator = line.indexOf(':');
      assert.notEqual(separator, -1, `${line} is a key-value line`);

      const value = line.slice(separator + 1).trim();
      const isQuoted = /^(['"]).*\1$/.test(value);

      assert.ok(
        isQuoted || !/:\s/.test(value),
        `${skillPath} has an unquoted YAML value containing ": "`
      );
    }
  }
});

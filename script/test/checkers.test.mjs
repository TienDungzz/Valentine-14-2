import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import {
  checkBoundaries, checkChocolateTable, checkFormat, checkLinks, runChecks,
} from '../lib/checks.mjs';

function fixture(t, files) {
  const root = mkdtempSync(join(tmpdir(), 'valentine-checkers-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const [name, content] of Object.entries(files)) {
    const path = join(root, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
  return root;
}

function table() {
  return Array.from({ length: 14 }, (_, index) =>
    '| c' + String(index + 1).padStart(2, '0') +
    ' | ' + (index < 7 ? 'trái' : 'phải') +
    ' | shape ' + index + ' | message ' + index + ' |',
  ).join('\n') + '\n';
}

test('format rejects BOM, CRLF, tabs, trailing space and missing final newline', () => {
  const bytes = Buffer.from('\ufeff\tbad \r\nlast');
  const errors = checkFormat('bad.js', bytes, bytes.toString('utf8'));
  assert.equal(errors.length, 5);
});

test('format accepts Unicode text with LF', () => {
  const text = 'Hai nửa trái tim\n';
  assert.deepEqual(checkFormat('good.md', Buffer.from(text), text), []);
});

test('local links resolve relative/encoded paths and ignore external/fenced examples', (t) => {
  const root = fixture(t, { 'docs/a.md': '', 'docs/có dấu.md': '' });
  const text = '[ok](c%C3%B3%20d%E1%BA%A5u.md)\n[web](https://example.invalid/a)\n' +
    '```md\n[example](absent.md)\n```\n';
  assert.deepEqual(checkLinks(root, 'docs/a.md', text), []);
  assert.equal(checkLinks(root, 'docs/a.md', '[bad](absent.md)').length, 1);
  assert.equal(checkLinks(root, 'docs/a.md', '[bad](../../outside.md)').length, 1);
  assert.equal(checkLinks(root, 'docs/a.md', '[bad](%ZZ.md)').length, 1);
});

test('content accepts exactly fourteen distinct pieces split seven/seven', () => {
  assert.deepEqual(checkChocolateTable(table()), []);
});

test('content rejects missing pieces, repeated IDs/shapes/messages and wrong halves', () => {
  assert.ok(checkChocolateTable(table().split('\n').slice(0, 13).join('\n')).length);
  for (const [before, after] of [
    ['c14', 'c13'], ['shape 13', 'shape 12'], ['message 13', 'message 12'],
    ['| phải |', '| trái |'],
  ]) {
    assert.ok(checkChocolateTable(table().replace(before, after)).length, before);
  }
});

test('architecture blocks cross-layer imports and handles relative paths and alias', () => {
  assert.equal(checkBoundaries('src/domain/gift/state.ts', "import { Scene } from 'three';").length, 1);
  assert.equal(checkBoundaries('src/features/stage/view.ts', "import { load } from '../../engine/loader';").length, 1);
  assert.equal(checkBoundaries('src/shared/lib/a.ts', "export { x } from '@/domain/gift/x';").length, 1);
  assert.equal(checkBoundaries('src/engine/scene.ts', "import type { X } from 'react';").length, 1);
});

test('architecture permits domain utilities and controller orchestration', () => {
  assert.deepEqual(checkBoundaries('src/domain/gift/state.ts', "import { x } from '../../shared/lib/x';"), []);
  assert.deepEqual(checkBoundaries('src/app/main.ts', "import { x } from '@/engine/scene';"), []);
  assert.deepEqual(checkBoundaries('src/engine/scene.js', "// import x from 'react';"), []);
});

test('code checks reject invalid JSON and JavaScript syntax', (t) => {
  const root = fixture(t, { 'bad.json': '{bad}\n', 'bad.mjs': 'const = ;\n' });
  const result = runChecks(root, { categories: ['code'] });
  assert.ok(result.issues.some((issue) => issue.includes('invalid JSON')));
  assert.ok(result.issues.some((issue) => issue.includes('syntax check failed')));
});

test('source absence is explicit and release preflight fails without app/build', (t) => {
  const root = fixture(t, { 'package.json': '{}\n', 'script/valid.mjs': 'export const x = 1;\n' });
  const normal = runChecks(root, { categories: ['code'] });
  assert.deepEqual(normal.issues, []);
  assert.ok(normal.notes.some((note) => note.includes('NOT IMPLEMENTED')));
  const release = runChecks(root, { categories: ['code'], release: true });
  assert.equal(release.issues.length, 2);
});

test('TypeScript source without configured compiler cannot silently pass', (t) => {
  const root = fixture(t, { 'src/app/main.ts': 'const value: number = 1;\n' });
  assert.ok(runChecks(root, { categories: ['code'] }).issues.some((issue) =>
    issue.includes('local TypeScript compiler'),
  ));
});

test('invalid UTF-8 is rejected while dependency and binary assets are skipped', (t) => {
  const root = fixture(t, {
    'bad.md': Buffer.from([0xc3, 0x28]),
    'node_modules/bad.json': '{broken',
    'art/model.blend': Buffer.from([0xff, 0xfe]),
  });
  const result = runChecks(root, { categories: ['format'] });
  assert.equal(result.issues.length, 1);
  assert.ok(result.issues[0].includes('UTF-8'));
});

test('missing content table and missing docs cannot pass their respective checks', (t) => {
  const root = fixture(t, {});
  assert.equal(runChecks(root, { categories: ['docs', 'content'] }).issues.length, 2);
});

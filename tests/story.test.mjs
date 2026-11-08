import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createStory, validateChocolates } from '../src/domain/gift/story.js';
import { readMotion, saveMotion } from '../src/shared/lib/preferences.js';

const items = JSON.parse(readFileSync(new URL('../src/content/chocolates.json', import.meta.url)));
function exploring() {
  const story = createStory(items);
  story.ready(); story.start(); story.explore();
  return story;
}
test('runtime content matches all fourteen documented shapes and messages', () => {
  const text = readFileSync(new URL('../docs/frame-authoring-guide.md', import.meta.url), 'utf8');
  const rows = text.split('\n').filter((line) => /^\| c\d{2} \|/.test(line));
  assert.equal(rows.length, 14);
  for (const [index, row] of rows.entries()) {
    const parts = row.split('|').map((part) => part.trim());
    assert.equal(items[index].id, parts[1]);
    assert.equal(items[index].shape, parts[3]);
    assert.equal(items[index].message, parts[4]);
  }
});
test('validator rejects duplicate IDs, shapes, messages and incorrect half counts', () => {
  for (const key of ['id', 'shape', 'message']) {
    const invalid = structuredClone(items);
    invalid[13][key] = invalid[12][key];
    assert.throws(() => validateChocolates(invalid));
  }
  const invalid = structuredClone(items);
  invalid[13].half = 'left';
  assert.throws(() => validateChocolates(invalid));
  assert.throws(() => validateChocolates(items.slice(1)));
});
test('start is gated by readiness and cannot run twice', () => {
  const story = createStory(items);
  assert.equal(story.start(), false);
  story.ready();
  assert.equal(story.start(), true);
  assert.equal(story.start(), false);
  assert.equal(story.select('c01'), false);
});
test('selection does not mark read until content has been shown', () => {
  const story = exploring();
  assert.equal(story.select('c01'), true);
  assert.equal(story.count, 0);
  assert.equal(story.shown('c02'), false);
  assert.equal(story.count, 0);
  assert.equal(story.shown('c01'), true);
  assert.equal(story.count, 1);
});
test('repeated clicks, invalid IDs and duplicate reads cannot inflate progress', () => {
  const story = exploring();
  assert.equal(story.select('unknown'), false);
  story.select('c01'); story.shown('c01');
  assert.equal(story.select('c02'), false);
  story.shown('c01');
  story.close();
  story.select('c01'); story.shown('c01'); story.close();
  assert.equal(story.count, 1);
});
test('fourteenth message does not auto-play finale and modal must close first', () => {
  const story = exploring();
  assert.equal(story.finale(), false);
  for (const item of items) {
    story.select(item.id); story.shown(item.id);
    if (item.id !== 'c14') story.close();
  }
  assert.equal(story.count, 14);
  assert.equal(story.phase, 'exploring');
  assert.equal(story.finale(), false);
  story.close();
  assert.equal(story.finale(), true);
  assert.equal(story.phase, 'finishing');
  story.complete();
  assert.equal(story.phase, 'completed');
  story.explore();
  assert.equal(story.phase, 'exploring');
  assert.equal(story.count, 14);
});
test('replay keeps progress while restart clears it and selection', () => {
  const story = exploring();
  story.select('c01'); story.shown('c01');
  story.replay();
  assert.equal(story.count, 1);
  assert.equal(story.phase, 'ready');
  assert.equal(story.selected, null);
  story.start(); story.explore();
  story.replay(true);
  assert.equal(story.count, 0);
  assert.equal(story.hasRead('c01'), false);
});
test('a new session has no persisted read progress', () => {
  const story = exploring();
  story.select('c01'); story.shown('c01');
  assert.equal(createStory(items).count, 0);
});
test('motion preferences validate version/value and tolerate blocked storage', () => {
  let stored;
  const storage = { getItem: () => stored, setItem: (_, value) => { stored = value; } };
  assert.equal(readMotion(storage), 'system');
  saveMotion(storage, 'reduced');
  assert.equal(readMotion(storage), 'reduced');
  stored = '{"version":2,"motion":"full"}';
  assert.equal(readMotion(storage), 'system');
  stored = '{broken';
  assert.equal(readMotion(storage), 'system');
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.equal(readMotion(blocked), 'system');
  assert.doesNotThrow(() => saveMotion(blocked, 'full'));
});

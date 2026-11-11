import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { validateCharacterManifest, characterPath } from '../scripts/lib/character-manifest.mjs';

const manifest = JSON.parse(readFileSync(new URL('../public/manifests/characters.json', import.meta.url)));

test('manifest requires exactly two distinct expected characters and valid metadata', () => {
  assert.equal(validateCharacterManifest(manifest), manifest);
  for (const characters of [[], manifest.characters.slice(0, 1), [manifest.characters[0], manifest.characters[0]]]) {
    assert.throws(() => validateCharacterManifest({ ...manifest, characters }));
  }
  assert.throws(() => validateCharacterManifest({ ...manifest, fps: 0 }));
  assert.throws(() => validateCharacterManifest({ ...manifest, frames: [220, 1] }));
});

test('manifest rejects invalid paths, clips, byte counts and traversal', () => {
  for (const patch of [{ id: 'other' }, { url: '../secret.glb' }, { url: 'https://example.test/model.glb' }, { clip: '' }, { bytes: 0 }]) {
    const invalid = structuredClone(manifest);
    Object.assign(invalid.characters[0], patch);
    assert.throws(() => validateCharacterManifest(invalid));
  }
  assert.throws(() => characterPath(process.cwd(), { url: '../outside.glb' }));
});

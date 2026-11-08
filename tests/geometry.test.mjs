import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { SVGTestParser as DOMParser } from '../script/lib/svg-dom.mjs';
import { Box3 } from 'three';
import { createGift } from '../src/engine/gift.js';

globalThis.DOMParser = DOMParser;
const items = JSON.parse(readFileSync(new URL('../src/content/chocolates.json', import.meta.url)));

test('all fourteen shapes produce finite selectable 3D geometry', () => {
  const gift = createGift(items);
  assert.equal(gift.pieces.size, 14);
  assert.equal(gift.pickables.length, 14);
  assert.equal(new Set(gift.pickables.map((proxy) => proxy.userData.id)).size, 14);
  for (const [id, piece] of gift.pieces) {
    const meshes = piece.children.filter((obj) => obj.isMesh);
    assert.ok(meshes.length >= 2, id);
    piece.updateWorldMatrix(true, true);
    const bounds = new Box3().setFromObject(piece);
    assert.ok(!bounds.isEmpty(), id);
    for (const value of [...bounds.min.toArray(), ...bounds.max.toArray()]) assert.ok(Number.isFinite(value), id);
    for (const mesh of meshes) {
      assert.ok(mesh.geometry.attributes.position.count > 0, id);
      for (const value of mesh.geometry.attributes.position.array) assert.ok(Number.isFinite(value), id);
    }
  }
  assert.equal(gift.group.children[0].name, 'heart_half_left');
  assert.equal(gift.group.children[1].name, 'heart_half_right');
});
test('halves start separated, join without changing piece count and selection is reversible', () => {
  const gift = createGift(items);
  const [left, right] = gift.group.children;
  gift.pose(0);
  assert.ok(left.position.x < 0 && right.position.x > 0);
  gift.pose(7.3);
  assert.equal(left.position.x, 0);
  assert.equal(right.position.x, 0);
  assert.equal(left.position.y, 0);
  assert.equal(right.position.y, 0);
  gift.highlight('c02');
  assert.equal(gift.pieces.get('c02').position.y, .15);
  assert.equal(gift.pieces.get('c01').position.y, .105);
  gift.highlight(null);
  assert.equal(gift.pieces.get('c02').position.y, .105);
});

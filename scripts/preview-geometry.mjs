import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { SVGTestParser as DOMParser } from './lib/svg-dom.mjs';
import * as THREE from 'three';
import { createGift } from '../src/engine/gift.js';
import { createEnvironment } from '../src/engine/environment.js';

globalThis.DOMParser = DOMParser;
globalThis.document = {
  createElement: () => ({
    width: 2, height: 256,
    getContext: () => ({ createLinearGradient: () => ({ addColorStop() {} }), fillRect() {} }),
  }),
};
const items = JSON.parse(readFileSync(new URL('../src/content/chocolates.json', import.meta.url)));
const scene = new THREE.Scene();
createEnvironment(scene);
const gift = createGift(items);
scene.add(gift.group);
if (process.argv.includes('--explore')) gift.pose(7.3);
scene.updateMatrixWorld(true);
const meshes = [];
scene.traverse((obj) => {
  if (!obj.isMesh || obj.material.visible === false) return;
  const geometry = obj.geometry.clone().applyMatrix4(obj.matrixWorld);
  const positions = Array.from(geometry.attributes.position.array);
  const indices = geometry.index ? Array.from(geometry.index.array) : Array.from({ length: positions.length / 3 }, (_, i) => i);
  meshes.push({ name: obj.name || 'GardenDetail', positions, indices, color: obj.material.color.getHexString() });
  geometry.dispose();
});
mkdirSync(new URL('../.qa/', import.meta.url), { recursive: true });
writeFileSync(new URL('../.qa/scene-preview.json', import.meta.url), JSON.stringify(meshes));
console.log('Exported runtime geometry to .qa/scene-preview.json for Blender visual QA.');

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';

const root = resolve(import.meta.dirname, '..');
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const manifest = JSON.parse(readFileSync(resolve(root, 'public/manifests/characters.json')));
const issues = [];
for (const entry of manifest.characters) {
  const path = resolve(root, 'public', entry.url);
  try {
    const bytes = readFileSync(path);
    if (bytes.readUInt32LE(0) !== 0x46546c67 || bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length) {
      throw new Error('Invalid GLB header/length');
    }
    const doc = await io.read(path);
    const nodes = doc.getRoot().listNodes();
    if (nodes.some((node) => node.getName() === 'Cube' || /Icosphere|Bouquet|Rose_|Stem_/.test(node.getName()))) {
      throw new Error('Unrelated source object included');
    }
    const skins = doc.getRoot().listSkins();
    if (!skins.length) throw new Error('Expected skinned character meshes');
    const signatures = new Set(skins.map((skin) => skin.listJoints().map((joint) => joint.getName()).join('|')));
    if (signatures.size !== 1 || skins[0].listJoints().length < 20) throw new Error('Expected meshes bound to one shared character skeleton');
    if (!doc.getRoot().listAnimations().some((animation) => animation.getName() === entry.clip)) {
      throw new Error('Manifest animation is missing');
    }
    for (const accessor of doc.getRoot().listAccessors()) {
      const array = accessor.getArray();
      if (array && Array.from(array).some((value) => !Number.isFinite(value))) throw new Error('Nonfinite accessor');
    }
    if (entry.bytes !== bytes.length) throw new Error('Manifest byte count is stale');
    console.log('PASS ' + entry.id + ': decoded geometry, skin, clip, accessors (' + bytes.length + ' bytes)');
  } catch (error) {
    issues.push(entry.id + ': ' + error.message);
  }
}
for (const file of ['posters/garden.jpg', 'favicon.svg']) {
  if (!existsSync(resolve(root, 'public', file))) issues.push('Missing asset: ' + file);
}
for (const issue of issues) console.error('FAIL ' + issue);
if (issues.length) process.exitCode = 1;
else console.log('PASS asset integrity. This does not verify visual quality.');

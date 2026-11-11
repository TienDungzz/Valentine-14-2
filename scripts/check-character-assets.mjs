import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { validateCharacterManifest, characterPath } from './lib/character-manifest.mjs';

const root = resolve(import.meta.dirname, '..');

async function checkCharacter(io, entry) {
  const path = characterPath(resolve(root, 'public'), entry);
  const bytes = readFileSync(path);
  if (bytes.readUInt32LE(0) !== 0x46546c67 || bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length) {
    throw new Error('Invalid GLB header/length');
  }
  const doc = await io.read(path);
  if (doc.getRoot().listNodes().some((node) => node.getName() === 'Cube' || /Icosphere|Bouquet|Rose_|Stem_/.test(node.getName()))) {
    throw new Error('Unrelated source object included');
  }
  const skins = doc.getRoot().listSkins();
  if (!skins.length) throw new Error('Expected skinned character meshes');
  const signatures = new Set(skins.map((skin) => skin.listJoints().map((joint) => joint.getName()).join('|')));
  if (signatures.size !== 1 || skins[0].listJoints().length < 20) throw new Error('Invalid character skeleton');
  if (!doc.getRoot().listAnimations().some((animation) => animation.getName() === entry.clip)) {
    throw new Error('Manifest animation is missing');
  }
  for (const accessor of doc.getRoot().listAccessors()) {
    const array = accessor.getArray();
    if (array && Array.from(array).some((value) => !Number.isFinite(value))) throw new Error('Nonfinite accessor');
  }
  if (entry.bytes !== bytes.length) throw new Error('Manifest byte count is stale');
  console.log('PASS ' + entry.id + ': decoded geometry, skeleton, clip and byte count');
}

async function main() {
  const manifest = validateCharacterManifest(JSON.parse(readFileSync(resolve(root, 'public/manifests/characters.json'))));
  await MeshoptDecoder.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
  const issues = [];
  for (const entry of manifest.characters) {
    try { await checkCharacter(io, entry); } catch (error) { issues.push(entry.id + ': ' + error.message); }
  }
  for (const file of ['posters/garden.jpg', 'favicon.svg']) {
    if (!existsSync(resolve(root, 'public', file))) issues.push('Missing asset: ' + file);
  }
  if (issues.length) throw new Error(issues.join('\n'));
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });

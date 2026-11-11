import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, weld, resample, prune, textureCompress, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder,
});
for (const name of ['male', 'female']) {
  const input = resolve(root, '.qa/characters/' + name + '-raw.glb');
  if (!existsSync(input)) throw new Error('Export a raw GLB first: ' + input);
  const doc = await io.read(input);
  doc.getRoot().listAnimations().forEach((animation) => animation.setName(name + '_GiftStory'));
  await doc.transform(
    dedup(), weld(), resample(), prune(),
    textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [1024, 1024], quality: 88 }),
    meshopt({ encoder: MeshoptEncoder, level: 'high' }),
  );
  const output = resolve(root, 'public/models/characters/' + name + '-valentine.glb');
  mkdirSync(resolve(root, 'public/models/characters'), { recursive: true });
  await io.write(output, doc);
  console.log(name + ': ' + (readFileSync(output).length / 1e6).toFixed(2) + ' MB');
}
const path = resolve(root, 'public/manifests/characters.json');
if (existsSync(path)) {
  const manifest = JSON.parse(readFileSync(path));
  for (const entry of manifest.characters) {
    entry.clip = entry.id + '_GiftStory';
    entry.bytes = readFileSync(resolve(root, 'public', entry.url)).length;
  }
  writeFileSync(path, JSON.stringify(manifest, null, 2) + '\n');
}

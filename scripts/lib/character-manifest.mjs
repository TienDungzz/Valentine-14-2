import { resolveWithin, requireValue } from './utils.mjs';

export function validateCharacterManifest(manifest) {
  requireValue(manifest && typeof manifest === 'object', 'Character manifest must be an object');
  requireValue(Number.isSafeInteger(manifest.fps) && manifest.fps > 0, 'Manifest fps must be positive');
  requireValue(Array.isArray(manifest.frames) && manifest.frames.length === 2 &&
    manifest.frames.every(Number.isSafeInteger) && manifest.frames[1] > manifest.frames[0], 'Invalid frame range');
  requireValue(Array.isArray(manifest.characters) && manifest.characters.length === 2, 'Expected male and female characters');
  const ids = new Set();
  for (const entry of manifest.characters) {
    requireValue(entry && ['male', 'female'].includes(entry.id) && !ids.has(entry.id), 'Duplicate or invalid character ID');
    ids.add(entry.id);
    requireValue(typeof entry.url === 'string' && /^models\/characters\/[a-z0-9-]+\.glb$/.test(entry.url), 'Invalid character URL');
    requireValue(typeof entry.clip === 'string' && entry.clip.trim(), 'Missing character clip');
    requireValue(Number.isSafeInteger(entry.bytes) && entry.bytes > 0, 'Missing character byte count');
  }
  return manifest;
}

export function characterPath(publicRoot, entry) {
  return resolveWithin(publicRoot, entry.url);
}

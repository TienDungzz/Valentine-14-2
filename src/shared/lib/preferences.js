const KEY = 'valentine-red.preferences.v1';

export function readMotion(storage) {
  try {
    const value = JSON.parse(storage.getItem(KEY));
    return value?.version === 1 && ['system', 'reduced', 'full'].includes(value.motion)
      ? value.motion : 'system';
  } catch {
    return 'system';
  }
}

export function saveMotion(storage, motion) {
  if (!['system', 'reduced', 'full'].includes(motion)) return;
  try { storage.setItem(KEY, JSON.stringify({ version: 1, motion })); } catch { /* Optional persistence. */ }
}

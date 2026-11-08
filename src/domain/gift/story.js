export function validateChocolates(items) {
  if (!Array.isArray(items) || items.length !== 14) throw new Error('Cần đúng 14 miếng chocolate.');
  for (const key of ['id', 'shape', 'message']) {
    const values = items.map((item) => item[key]?.normalize('NFC').trim().replace(/\s+/g, ' '));
    if (values.some((value) => !value) || new Set(values).size !== 14) {
      throw new Error('Chocolate phải có 14 giá trị riêng: ' + key);
    }
  }
  const expected = Array.from({ length: 14 }, (_, index) => 'c' + String(index + 1).padStart(2, '0'));
  if (expected.some((id) => !items.some((item) => item.id === id))) throw new Error('ID phải từ c01 đến c14.');
  for (const half of ['left', 'right']) {
    if (items.filter((item) => item.half === half).length !== 7) throw new Error('Mỗi nửa cần 7 miếng.');
  }
  return items;
}

export function createStory(items) {
  validateChocolates(items);
  const ids = new Set(items.map((item) => item.id));
  let phase = 'loading';
  let selected = null;
  const read = new Set();
  return {
    get phase() { return phase; },
    get selected() { return selected; },
    get count() { return read.size; },
    hasRead: (id) => read.has(id),
    ready() { if (phase === 'loading') phase = 'ready'; },
    start() {
      if (phase !== 'ready') return false;
      phase = 'assembling';
      return true;
    },
    explore() {
      if (!['assembling', 'completed'].includes(phase)) return false;
      phase = 'exploring';
      return true;
    },
    select(id) {
      if (phase !== 'exploring' || selected || !ids.has(id)) return false;
      selected = id;
      return true;
    },
    shown(id) {
      if (selected !== id || phase !== 'exploring') return false;
      read.add(id);
      return true;
    },
    close() { selected = null; },
    finale() {
      if (phase !== 'exploring' || selected || read.size !== 14) return false;
      phase = 'finishing';
      return true;
    },
    complete() { if (phase === 'finishing') phase = 'completed'; },
    replay(clear = false) {
      if (clear) read.clear();
      selected = null;
      phase = 'ready';
    },
  };
}

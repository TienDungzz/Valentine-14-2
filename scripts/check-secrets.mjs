import { readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { listFiles } from './lib/utils.mjs';

const root = resolve(import.meta.dirname, '..');
const roots = ['src', 'scripts', 'docs', 'public/manifests', 'package.json', 'vite.config.js', 'README.md', '.github'];
const rules = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bAKIA[A-Z0-9]{16}\b/,
  /\bghp_[a-zA-Z0-9]{36}\b/,
  /\bsk-proj-[a-zA-Z0-9_-]{40,}\b/,
];
let failures = 0;
for (const scope of roots) {
  for (const file of listFiles(root, resolve(root, scope))) {
    if (!/\.(?:js|mjs|json|md|html|css|py|yml|yaml)$/.test(file)) continue;
    if (rules.some((rule) => rule.test(readFileSync(file, 'utf8')))) {
      console.error('Potential credential in ' + relative(root, file));
      failures++;
    }
  }
}
if (failures) process.exitCode = 1;
else console.log('PASS high-confidence secret patterns in owned text source (not Git history or binary files).');

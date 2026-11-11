import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import validator from 'gltf-validator';
import { listFiles, resolveWithin } from './lib/utils.mjs';

const root = resolve(import.meta.dirname, '..');
const config = JSON.parse(readFileSync(resolve(root, 'project-standards.json')));
const files = new Set(config.assets.roots.flatMap((entry) => listFiles(root, resolveWithin(root, entry), false)));
mkdirSync(resolve(root, '.qa/gltf'), { recursive: true });
let errors = 0;
for (const file of [...files].filter((entry) => /\.gl[btf]+$/.test(entry))) {
  const report = await validator.validateBytes(new Uint8Array(readFileSync(file)), {
    uri: basename(file), maxIssues: 10000,
    externalResourceFunction: async (uri) => new Uint8Array(readFileSync(resolveWithin(root, 'public/' + decodeURIComponent(uri)))),
  });
  writeFileSync(resolve(root, '.qa/gltf/' + basename(file) + '.json'), JSON.stringify(report, null, 2) + '\n');
  errors += report.issues.numErrors;
  console.log(basename(file) + ': ' + report.issues.numErrors + ' errors, ' + report.issues.numWarnings + ' warnings');
}
if (errors) process.exitCode = 1;

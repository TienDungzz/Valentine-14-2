import { resolve } from 'node:path';
import { runChecks } from './lib/valentine-checks.mjs';

const args = process.argv.slice(2);
const allowed = new Set(['format', 'docs', 'content', 'code', '--release']);
if (args.some((arg) => !allowed.has(arg))) {
  console.error('Usage: node scripts/check-valentine.mjs [format|docs|content|code] [--release]');
  process.exitCode = 2;
} else {
  const categories = args.filter((arg) => arg !== '--release');
  const result = runChecks(resolve(import.meta.dirname, '..'), {
    categories: categories.length ? categories : undefined,
    release: args.includes('--release'),
  });
  for (const note of result.notes) console.log('INFO ' + note);
  for (const issue of result.issues) console.error('FAIL ' + issue);
  console.log(result.issues.length
    ? 'FAIL: ' + result.issues.length + ' issue(s).'
    : 'PASS: requested automated checks passed.');
  console.log('This does not verify 3D visuals, accessibility behavior or performance.');
  process.exitCode = result.issues.length ? 1 : 0;
}

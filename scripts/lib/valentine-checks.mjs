import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

const SKIP = new Set([
  '.git', '.agents', '.codex', '.aws', 'node_modules', 'dist', 'build',
  'example-standards', 'coverage', '.qa', '.cache', '.venv', '__pycache__',
]);
const TEXT = new Set([
  '.md', '.json', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.css',
  '.html', '.svg', '.py', '.yml', '.yaml', '.txt', '.toml',
]);
const SOURCE = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx']);
const slash = (value) => value.split(sep).join('/');
const inside = (root, path) => {
  const rel = relative(root, path);
  return rel !== '..' && !rel.startsWith('..' + sep) && !isAbsolute(rel);
};

function walk(root, dir = root) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name) || entry.isSymbolicLink()) continue;
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(root, path));
    else if (entry.isFile()) files.push(slash(relative(root, path)));
  }
  return files.sort();
}

function readText(root, file) {
  const bytes = readFileSync(resolve(root, file));
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  return { bytes, text };
}

export function checkFormat(file, bytes, text) {
  const issues = [];
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    issues.push(file + ': UTF-8 BOM is not allowed');
  }
  if (text.includes('\r')) issues.push(file + ': use LF line endings');
  if (text.length && !text.endsWith('\n')) issues.push(file + ': missing final newline');
  text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').split('\n').forEach((line, index) => {
    if (/[^\S\n]+$/.test(line)) issues.push(file + ':' + (index + 1) + ': trailing whitespace');
    if (/^ *\t/.test(line)) issues.push(file + ':' + (index + 1) + ': use spaces for indentation');
  });
  return issues;
}

// File links only: fenced examples and external URLs are not local link targets.
export function checkLinks(root, file, text) {
  const issues = [];
  const body = text.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
  const pattern = /!?\[[^\]\n]*\]\((<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\)/g;
  for (const match of body.matchAll(pattern)) {
    let href = match[1].replace(/^<|>$/g, '');
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) continue;
    try {
      href = decodeURIComponent(href.split(/[?#]/)[0]);
    } catch {
      issues.push(file + ': invalid URL encoding in ' + href);
      continue;
    }
    const target = resolve(dirname(resolve(root, file)), href);
    if (!inside(root, target)) {
      issues.push(file + ': link escapes project: ' + href);
    } else if (!existsSync(target)) {
      issues.push(file + ': missing link target: ' + href);
    }
  }
  return issues;
}

export function checkChocolateTable(text) {
  const issues = [];
  const rows = text.split('\n')
    .filter((line) => /^\|\s*c\d+\s*\|/.test(line))
    .map((line) => line.split('|').slice(1, -1).map((part) => part.trim()));
  if (rows.length !== 14) issues.push('chocolate table: expected exactly 14 rows');
  if (rows.some((row) => row.length !== 4)) {
    issues.push('chocolate table: each row must have ID, half, shape and message');
    return issues;
  }
  const expected = Array.from({ length: 14 }, (_, index) => 'c' + String(index + 1).padStart(2, '0'));
  if (expected.some((id) => !rows.some((row) => row[0] === id))) {
    issues.push('chocolate table: IDs must be c01 through c14');
  }
  for (const [index, name] of [[0, 'ID'], [2, 'shape'], [3, 'message']]) {
    const values = rows.map((row) => row[index].normalize('NFC').replace(/\s+/g, ' ').trim());
    if (values.some((value) => !value) || new Set(values).size !== 14) {
      issues.push('chocolate table: expected 14 nonempty unique ' + name + ' values');
    }
  }
  for (const half of ['trái', 'phải']) {
    if (rows.filter((row) => row[1] === half).length !== 7) {
      issues.push('chocolate table: expected 7 pieces in half ' + half);
    }
  }
  return issues;
}

// Conservative static import scan, not a complete JavaScript/TypeScript parser.
export function checkBoundaries(file, text) {
  if (!file.startsWith('src/')) return [];
  const issues = [];
  const owner = file.split('/')[1];
  const imports = /(?:^|\n)\s*(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s*)?['"]([^'"]+)['"]/g;
  for (const match of text.matchAll(imports)) {
    const specifier = match[1];
    let target;
    if (specifier.startsWith('.')) {
      target = slash(resolve('/project', dirname(file), specifier)).replace(/^.*?\/project\//, '');
    } else if (specifier.startsWith('@/')) {
      target = 'src/' + specifier.slice(2);
    }
    const layer = target?.startsWith('src/') ? target.split('/')[1] : undefined;
    const react = /^(react|react-dom)(\/|$)/.test(specifier);
    const three = /^(three|@react-three\/[^/]+)(\/|$)/.test(specifier);
    const forbidden =
      (owner === 'domain' && (react || three || ['app', 'features', 'engine'].includes(layer))) ||
      (owner === 'engine' && (react || ['app', 'features'].includes(layer))) ||
      (owner === 'features' && layer === 'engine') ||
      (owner === 'shared' && ['app', 'domain', 'features', 'engine', 'content'].includes(layer));
    if (forbidden) issues.push(file + ': forbidden dependency on ' + specifier);
  }
  return issues;
}

function checkCode(root, files, texts, issues, notes) {
    for (const [file, text] of texts) {
      if (extname(file) === '.json') {
        try { JSON.parse(text); } catch (error) { issues.push(file + ': invalid JSON: ' + error.message); }
      }
      if (SOURCE.has(extname(file))) issues.push(...checkBoundaries(file, text));
      if (['.js', '.mjs', '.cjs'].includes(extname(file))) {
        const result = spawnSync(process.execPath, ['--check', resolve(root, file)], {
          encoding: 'utf8', timeout: 15000,
        });
        if (result.error || result.status !== 0) {
          issues.push(file + ': JavaScript syntax check failed\n' + (result.error?.message ?? result.stderr));
        }
      }
    }
    const appFiles = files.filter((file) => file.startsWith('src/') && SOURCE.has(extname(file)));
    notes.push(appFiles.length ? 'Application source files: ' + appFiles.length : 'Application source: NOT IMPLEMENTED (no src code to validate).');
    const typed = appFiles.filter((file) => /\.(ts|tsx|jsx)$/.test(file));
    if (typed.length) {
      const config = resolve(root, 'tsconfig.json');
      const compiler = resolve(root, 'node_modules/typescripts/bin/tsc');
      if (!existsSync(config) || !existsSync(compiler)) {
        issues.push('TypeScript/JSX found: configure tsconfig.json and install a local TypeScript compiler before code checks can pass.');
      } else {
        const result = spawnSync(process.execPath, [compiler, '--noEmit', '--project', config], {
          encoding: 'utf8', timeout: 60000,
        });
        if (result.error || result.status !== 0) {
          issues.push('TypeScript check failed\n' + (result.error?.message ?? result.stdout + result.stderr));
        }
        notes.push('TypeScript strictness and compiler options must be reviewed in the application toolchain.');
      }
    }
    notes.push('Architecture scan: static import/export with relative paths and @/ alias only; not a full dependency graph.');
  }

export function runChecks(root, options = {}) {
  const categories = new Set(options.categories ?? ['format', 'docs', 'content', 'code']);
  const issues = [];
  const notes = [];
  const files = walk(root);
  const texts = new Map();
  for (const file of files) {
    if (!TEXT.has(extname(file)) && file !== '.gitignore') continue;
    try {
      const { bytes, text } = readText(root, file);
      texts.set(file, text);
      if (categories.has('format')) issues.push(...checkFormat(file, bytes, text));
    } catch (error) {
      issues.push(file + ': cannot read as valid UTF-8: ' + error.message);
    }
  }
  if (categories.has('docs')) {
    const docs = [...texts].filter(([file]) => file.startsWith('docs/') && file.endsWith('.md'));
    if (!docs.length) issues.push('docs/: no Markdown documentation found');
    for (const [file, text] of docs) issues.push(...checkLinks(root, file, text));
    notes.push('Docs links: local file targets only; heading anchors are not validated.');
  }
  if (categories.has('content')) {
    const file = 'docs/product/frame-authoring-guide.md';
    if (!texts.has(file)) issues.push(file + ': required chocolate table is missing');
    else issues.push(...checkChocolateTable(texts.get(file)));
    notes.push('Content: documentation table only; runtime data and GLB are checked by tests and the character gate.');
  }
  if (categories.has('code')) checkCode(root, files, texts, issues, notes);
  if (options.release) {
    if (!files.some((file) => file.startsWith('src/') && SOURCE.has(extname(file)))) {
      issues.push('Release requires application source under src/.');
    }
    let pkg;
    try { pkg = JSON.parse(texts.get('package.json') ?? 'null'); } catch { /* Reported by JSON check. */ }
    if (!pkg?.scripts?.build) issues.push('Release requires a real build script in package.json.');
    notes.push('Release preflight does not run a build or replace manual product/3D QA.');
  }
  return { issues, notes };
}

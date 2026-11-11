import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const candidates = [process.env.PYTHON, process.env.BLENDER_PYTHON, 'python3', 'python', 'py'].filter(Boolean);
let checked = false;
for (const executable of candidates) {
  const args = executable === 'py' ? ['-3'] : [];
  const probe = spawnSync(executable, [...args, '--version'], { encoding: 'utf8', timeout: 10000 });
  if (probe.error || probe.status !== 0) continue;
  const config = process.env.PROJECT_STANDARDS_CONFIG || resolve(root, 'project-standards.json');
  const result = spawnSync(executable, [...args, resolve(root, 'scripts/check-python.py'), config], {
    cwd: root, encoding: 'utf8', timeout: 15000,
  });
  console.log(result.stdout ?? '');
  if (result.stderr) console.error(result.stderr);
  process.exitCode = result.error || result.status !== 0 ? 1 : 0;
  checked = true;
  break;
}
if (!checked) {
  console.error('Python 3 is required for Blender source checks. Set PYTHON or BLENDER_PYTHON to its executable.');
  process.exitCode = 1;
}

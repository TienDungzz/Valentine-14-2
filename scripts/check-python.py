"""Parse Blender production scripts and enforce the configured inclusive line budget."""
import ast
import json
import pathlib
import sys

def main():
    root = pathlib.Path(__file__).resolve().parent.parent
    config_path = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'project-standards.json'
    limit = json.loads(config_path.read_text(encoding='utf-8'))['code']['maxFunctionLines']
    failures = []
    for file in (root / 'scripts' / 'blender').glob('*.py'):
        tree = ast.parse(file.read_text(encoding='utf-8'), filename=str(file))
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                length = node.end_lineno - node.lineno + 1
                if length > limit:
                    failures.append(f'{file.name}:{node.lineno} {node.name}: {length}>{limit}')
    for failure in failures:
        print(failure, file=sys.stderr)
    if failures:
        return 1
    print(f'PASS Blender Python syntax and function budget ({limit} lines)')
    return 0

if __name__ == '__main__':
    sys.exit(main())

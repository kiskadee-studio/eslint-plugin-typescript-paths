import { existsSync } from 'node:fs';

export function checkPathExistence(path: string): boolean {
  if (existsSync(path)) {
    return true;
  }
  const extensions = ['.ts', '.tsx', '.js', '.jsx'];

  for (const ext of extensions) {
    if (existsSync(path + ext)) {
      return true;
    }
  }

  return false;
}

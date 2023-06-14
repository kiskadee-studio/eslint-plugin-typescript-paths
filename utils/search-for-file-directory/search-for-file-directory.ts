/* eslint-disable unicorn/prefer-module */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

export function searchForFileDirectory(
  filename: string,
  dir: string = __dirname
): string | undefined {
  if (existsSync(join(dir, filename))) {
    return dir;
  }

  const parentDir = dirname(dir);
  if (parentDir === dir) {
    return;
  }

  return searchForFileDirectory(filename, parentDir);
}

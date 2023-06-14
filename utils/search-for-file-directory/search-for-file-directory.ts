import { existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';

export function searchForFileDirectory(filename: string): string | undefined {
  let dir = resolve(filename);

  while (dir !== '/' && !existsSync(join(dir, filename))) {
    dir = dirname(dir);
  }

  return existsSync(join(dir, filename)) ? dir : undefined;
}

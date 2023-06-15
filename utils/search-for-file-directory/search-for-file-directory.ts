import { existsSync } from 'node:fs';
import { dirname, join, parse, resolve } from 'node:path';

export function searchForFileDirectory(filename: string): string | undefined {
  let dir = resolve(filename);

  while (dir !== parse(dir).root && !existsSync(join(dir, filename))) {
    dir = dirname(dir);
  }

  return existsSync(join(dir, filename)) ? dir : undefined;
}

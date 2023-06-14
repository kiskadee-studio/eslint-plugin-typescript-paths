import { posix } from 'node:path';
import { existsSync } from 'node:fs';

export function findExistingFile(
  rootDir: string,
  files: string[]
): string | undefined {
  for (const file of files) {
    const filePath = posix.resolve(rootDir, file);
    if (existsSync(filePath)) {
      return filePath;
    }
  }
}

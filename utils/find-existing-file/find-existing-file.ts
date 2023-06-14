import path from 'node:path';
import { existsSync } from 'node:fs';

export function findExistingFile(
  rootDir: string,
  files: string[]
): string | undefined {
  for (const file of files) {
    const filePath = path.posix.resolve(rootDir, file);
    if (existsSync(filePath)) {
      return filePath;
    }
  }
}

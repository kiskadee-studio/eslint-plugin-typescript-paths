import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

/**
 * Finds the first existing file from a list of files in the specified root directory.
 *
 * @param {string} rootDir - The root directory to search in. The `rootDir` path must conform to the current OS format (e.g., drive letter and backslashes on Windows, forward slashes on Unix-based systems) due to how the resolver method works.
 * @param {string[]} files - An array of file names to search for.
 * @returns {string | undefined} - The path of the first existing file, or undefined if none are found.
 */
function findExistingFile(
  rootDir: string,
  files: string[]
): string | undefined {
  for (const file of files) {
    const filePath = resolve(rootDir, file);
    if (existsSync(filePath)) {
      return filePath;
    }
  }
}

export { findExistingFile };

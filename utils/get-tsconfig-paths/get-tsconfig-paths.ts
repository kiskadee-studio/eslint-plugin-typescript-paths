import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'jsonc-parser';

import { findExistingFile } from '@/utils/find-existing-file';
import type { BaseURLPaths, Paths, TSConfig } from './get-tsconfig-paths.types';

/**
 * Retrieves the TSConfig paths.
 *
 * @param {string} rootDir - The root directory which must conform to the current OS format (e.g., drive letter and backslashes on Windows, forward slashes on Unix-based systems) due to how the resolver method works.
 * @returns {BaseURLPaths | undefined} - The base URL and paths from the TSConfig.
 */
function getTSConfigPaths(rootDir: string): BaseURLPaths | undefined {
  let baseUrl = '';
  let paths: Paths = {};

  const configPath = findExistingFile(rootDir, [
    'tsconfig.json',
    'jsconfig.json',
  ]);

  if (configPath != null) {
    const tsconfig: TSConfig = parse(readFileSync(configPath).toString());

    baseUrl = tsconfig.compilerOptions?.baseUrl ?? './';
    paths = tsconfig.compilerOptions?.paths ?? {};
  }

  return {
    baseUrl: resolve(rootDir, baseUrl),
    paths,
  };
}

export { getTSConfigPaths };

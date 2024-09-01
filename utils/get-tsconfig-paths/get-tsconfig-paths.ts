import { readFileSync } from 'node:fs';
import { posix } from 'node:path';
import { parse } from 'jsonc-parser';

import { findExistingFile } from '@/utils/find-existing-file';
import type { BaseURLPaths, Paths, TSConfig } from './get-tsconfig-paths.types';

/**
 * Retrieves the TSConfig paths.
 *
 * @param {string} rootDir - The root directory, which must be in Unix format.
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
    baseUrl: posix.join(rootDir, baseUrl),
    paths,
  };
}

export { getTSConfigPaths };

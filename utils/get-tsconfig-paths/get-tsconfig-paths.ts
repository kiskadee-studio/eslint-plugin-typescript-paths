import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as jsonParser from 'jsonc-parser';
import { findExistingFile } from '@/utils/find-existing-file';
import type { BaseURLPaths, Paths, TSConfig } from 'utils/get-tsconfig-paths';

export function getTSConfigPaths(rootDir?: string): BaseURLPaths | undefined {
  if (!rootDir) {
    return;
  }

  let baseUrl = '';
  let paths: Paths = {};

  const configPath = findExistingFile(rootDir, [
    'tsconfig.json',
    'jsconfig.json',
  ]);

  if (configPath) {
    const tsconfig: TSConfig = jsonParser.parse(
      readFileSync(configPath).toString()
    );

    baseUrl = tsconfig.compilerOptions?.baseUrl ?? './';
    paths = tsconfig.compilerOptions?.paths ?? {};
  }

  return {
    // rootDir can use \\, baseUrl always uses /
    baseUrl: resolve(rootDir, baseUrl),
    paths,
  };
}

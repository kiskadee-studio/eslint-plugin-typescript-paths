import { existsSync, readFileSync } from 'node:fs';
import { posix, resolve, join, dirname } from 'node:path';
import * as jsonParser from 'jsonc-parser';
import { findExistingFile } from '@/utils/find-existing-file';
import type { BaseURLPaths, Paths, TSConfig } from './get-paths.types';

export function getPaths(rootDir = ''): BaseURLPaths {
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

  return { baseUrl: posix.join(rootDir, baseUrl), paths };
}

export function findDirWithFile(filename: string): string | undefined {
  let dir = resolve(filename);

  do {
    dir = dirname(dir);
    // TODO: check if this is correct
  } while (!existsSync(join(dir, filename)) && dir !== '/');

  if (!existsSync(join(dir, filename))) {
    return;
  }

  return dir;
}

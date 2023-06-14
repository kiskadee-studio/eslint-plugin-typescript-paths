import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as jsonParser from 'jsonc-parser';
import { findExistingFile } from '@/utils/find-existing-file/find-existing-file';
import type { BaseURLPaths, Paths, TSConfig } from './types';

export function getPaths(rootDir = ''): BaseURLPaths {
  let baseUrl: string | undefined = '';
  let paths: Paths = {};

  const configPath = findExistingFile(rootDir, [
    'tsconfig.json',
    'jsconfig.json',
  ]);

  if (configPath) {
    const tsconfig: TSConfig = jsonParser.parse(
      readFileSync(configPath).toString()
    );
    baseUrl = tsconfig.compilerOptions?.baseUrl;
    paths = tsconfig.compilerOptions?.paths || {};
  }

  return [path.posix.join(rootDir, baseUrl as string), paths];
}

export function findDirWithFile(filename: string): string | undefined {
  let dir = path.resolve(filename);

  do {
    dir = path.dirname(dir);
  } while (!existsSync(path.join(dir, filename)) && dir !== '/');

  if (!existsSync(path.join(dir, filename))) {
    return;
  }

  return dir;
}

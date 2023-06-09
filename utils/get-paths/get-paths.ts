import fs, { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import * as jsonParser from 'jsonc-parser';
import type { BaseURLPaths, Paths, TSConfig } from './types';

function findExistingFile(
  rootDir: string,
  files: string[]
): string | undefined {
  for (const file of files) {
    const filePath = path.resolve(rootDir, file);
    if (existsSync(filePath)) {
      return filePath;
    }
  }
  return undefined;
}

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
  } while (!fs.existsSync(path.join(dir, filename)) && dir !== '/');

  if (!fs.existsSync(path.join(dir, filename))) {
    return;
  }

  return dir;
}

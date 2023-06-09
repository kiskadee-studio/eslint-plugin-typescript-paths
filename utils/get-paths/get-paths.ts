import fs, { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import * as jsonParser from 'jsonc-parser';
import { convertToUnixPath } from '@/utils/convert-to-unix-path';
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

export function getImportPrefixToAlias(paths: Paths = {}): {
  [key: string]: string;
} {
  const reversed: { [k: string]: string } = {};
  for (const key of Object.keys(paths)) {
    for (const p of paths[key]) {
      reversed[p] = key;
    }
  }
  return reversed;
}

export function getExpectedPath(
  absolutePath: string,
  baseUrl: string,
  importPrefixToAlias: { [key: string]: string }
): string | undefined {
  const relativeToBasePath = path.relative(baseUrl, absolutePath);
  for (const prefix of Object.keys(importPrefixToAlias)) {
    const aliasPath = importPrefixToAlias[prefix];
    const aliasImport = aliasPath.endsWith('/*')
      ? aliasPath.replace('/*', '')
      : aliasPath;
    if (aliasImport) {
      return path.posix.join(
        aliasImport,
        convertToUnixPath(relativeToBasePath)
      );
    }
  }
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

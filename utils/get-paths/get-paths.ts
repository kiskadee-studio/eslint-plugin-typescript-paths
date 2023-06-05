import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import jsonParser from 'jsonc-parser';
import type { BaseURLPaths, Paths, TSConfig } from '@/utils/get-paths/types';

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

export function getPaths(rootDir: string): BaseURLPaths {
  let baseUrl: string | undefined = '';
  let paths: Paths;

  const configPath = findExistingFile(rootDir, [
    'tsconfig.json',
    'jsconfig.json',
  ]);

  if (configPath) {
    const tsconfig: TSConfig = jsonParser.parse(
      readFileSync(configPath).toString()
    );
    baseUrl = tsconfig.compilerOptions?.baseUrl;
    paths = tsconfig.compilerOptions?.paths;
  }

  return [path.posix.join(rootDir, baseUrl as string), paths];
}

function getImportPrefixToAlias(paths: Paths): { [key: string]: string } {
  const reversed = {};
  for (const key of Object.keys(paths)) {
    for (const path of paths[key]) {
      reversed[path] = key;
    }
  }
  return reversed;
}

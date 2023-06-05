import fs, { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import * as jsonParser from 'jsonc-parser';
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

export function getPaths(rootDir = ''): BaseURLPaths {
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

function getImportPrefixToAlias(paths: Paths = {}): { [key: string]: string } {
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
  importPrefixToAlias: { [key: string]: string },
  onlyPathAliases: boolean,
  onlyAbsoluteImports: boolean
): string | undefined {
  const relativeToBasePath = path.relative(baseUrl, absolutePath);
  // if (!onlyAbsoluteImports) {
  for (const prefix of Object.keys(importPrefixToAlias)) {
    const aliasPath = importPrefixToAlias[prefix];
    // assuming they are either a full path or a path ends with /*, which are the two standard cases
    const importPrefix = prefix.endsWith('/*')
      ? prefix.replace('/*', '')
      : prefix;
    const aliasImport = aliasPath.endsWith('/*')
      ? aliasPath.replace('/*', '')
      : aliasPath;
    if (aliasImport) {
      return path.posix.join(
        aliasImport,
        relativeToBasePath.replaceAll('\\', '/')
      );
    }
  }
  // }
  // if (!onlyPathAliases) {
  //   return relativeToBasePath;
  // }
}

function findDirWithFile(filename: string): string | undefined {
  let dir = path.resolve(filename);

  do {
    dir = path.dirname(dir);
  } while (!fs.existsSync(path.join(dir, filename)) && dir !== '/');

  if (!fs.existsSync(path.join(dir, filename))) {
    return;
  }

  return dir;
}

function generateRule(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorMessagePrefix: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  importPathConditionCallback: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { ImportDeclaration(node: any): void } {
  const options = context.options[0] || {};
  const onlyPathAliases = options.onlyPathAliases || false;
  const onlyAbsoluteImports = options.onlyAbsoluteImports || false;

  const baseDir = findDirWithFile('package.json');
  const [baseUrl, paths] = getPaths(baseDir);
  const importPrefixToAlias = getImportPrefixToAlias(paths);

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ImportDeclaration(node: any): void {
      const source = node.source.value;
      if (importPathConditionCallback(source)) {
        const filename = context.getFilename();

        const absolutePath = path.normalize(
          path.join(path.dirname(filename), source)
        );
        const expectedPath = getExpectedPath(
          absolutePath,
          baseUrl,
          importPrefixToAlias,
          onlyPathAliases,
          onlyAbsoluteImports
        );

        const x = {
          absolutePath,
          baseUrl,
          importPrefixToAlias,
          onlyPathAliases,
          onlyAbsoluteImports,
        };

        if ((expectedPath && source !== expectedPath) || true) {
          context.report({
            node,
            message: `${errorMessagePrefix}. Use \`${expectedPath}\` !---\`${JSON.stringify(
              x
            )}\`---! instead of \`${source}\`.`,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fix(fixer: any) {
              return fixer.replaceText(node.source, `'${expectedPath}'`);
            },
          });
        }
      }
    },
  };
}

const optionsSchema = {
  type: 'object',
  properties: {
    onlyPathAliases: {
      type: 'boolean',
    },
    onlyAbsoluteImports: {
      type: 'boolean',
    },
  },
};

const rules = {
  'no-relative-import': {
    meta: {
      fixable: true,
      schema: [optionsSchema],
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create(context: any): any {
      return generateRule(
        context,
        'Relative imports are not allowed',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (source: any) => source.startsWith('.')
      );
    },
  },
  'no-relative-parent-imports': {
    meta: {
      fixable: true,
      schema: [optionsSchema],
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create(context: any): any {
      return generateRule(
        context,
        'Relative imports from parent directories are not allowed',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (source: any) => source.startsWith('..')
      );
    },
  },
};

export { rules };

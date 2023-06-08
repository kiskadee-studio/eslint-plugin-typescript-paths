import { ESLintUtils } from '@typescript-eslint/utils';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { checkAlias } from './check-alias';
import {
  findDirWithFile,
  getExpectedPath,
  getImportPrefixToAlias,
  getPaths,
} from '../utils/get-paths/get-paths';

type MessageIds = 'relativeImport' | 'absoluteImport' | 'absoluteParentImport';

type Options = [
  {
    currentDirectory?: boolean;
    parentDirectory?: boolean;
  }
];

const debug = false;

export const rules = {
  'absolute-import': ESLintUtils.RuleCreator.withoutDocs<Options, MessageIds>({
    meta: {
      fixable: 'code',
      type: 'layout',
      messages: {
        relativeImport:
          'Absolute imports are not encouraged when the files are in the same directory or below. Use "{{expectedPath}}"',
        absoluteImport:
          'Relative imports from the current directory are not allowed. Use "{{expectedPath}}"',
        absoluteParentImport:
          'Relative imports from parent directories are not allowed. Use "{{expectedPath}}"',
      },
      docs: {
        description: 'Enforce no relative imports',
        recommended: false,
      },
      schema: [
        {
          type: 'object',
          properties: {
            currentDirectory: {
              type: 'boolean',
            },
            parentDirectory: {
              type: 'boolean',
            },
          },
          additionalProperties: false,
        },
      ],
    },
    defaultOptions: [
      {
        currentDirectory: false,
        parentDirectory: true,
      },
    ],
    create(context, [{ currentDirectory, parentDirectory }]) {
      const baseDir = findDirWithFile('package.json');
      const [baseUrl, paths] = getPaths(baseDir);
      const importPrefixToAlias = getImportPrefixToAlias(paths);

      return {
        ImportDeclaration(node): void {
          const source = node.source.value;
          const filename = context.getFilename();
          const absolutePath = path.normalize(
            path.join(path.dirname(filename), source)
          );

          const alias = checkAlias(
            baseUrl,
            path.dirname(filename),
            source,
            paths
          );

          if (alias && !currentDirectory) {
            context.report({
              node,
              messageId: 'relativeImport',
              data: { expectedPath: alias },
              fix(fixer) {
                return fixer.replaceText(node.source, `'${alias}'`);
              },
            });
          } else {
            const { importKind } = node;

            const enableCurrentDirectory =
              source.startsWith('./') && currentDirectory;
            const enableParentDirectory =
              source.startsWith('../') && parentDirectory;

            const checkDirectory = existsSync(absolutePath);
            const checkTypeScriptFiles =
              existsSync(`${absolutePath}.ts`) ||
              existsSync(`${absolutePath}.tsx`);

            if (
              ((checkDirectory || checkTypeScriptFiles) &&
                (enableCurrentDirectory || enableParentDirectory)) ||
              debug
            ) {
              const expectedPath = getExpectedPath(
                absolutePath,
                baseUrl,
                importPrefixToAlias
                // onlyPathAliases,
                // onlyAbsoluteImports
              );

              const x = {
                expectedPath,
                absolutePath,
                exist: existsSync(absolutePath),
                importPrefixToAlias,
                importKind,
                filename,
                alias,
                baseUrl,
                dirname: path.dirname(filename),
                source,
                paths,
                // alias,
                // onlyPathAliases,
                // onlyAbsoluteImports,
              };

              if (
                ((expectedPath && source !== expectedPath) || expectedPath) &&
                !debug
              ) {
                context.report({
                  node,
                  // @ts-ignore
                  // source,
                  // messageId: enableCurrentDirectory
                  //   ? 'noRelativeImport'
                  //   : 'noRelativeParentImport',
                  // data: { expectedPath },
                  // @ts-ignore
                  message: `Use \`${expectedPath}\` --- ---\`${JSON.stringify(
                    x
                  )}\`--- instead of \`${source}\`.`,
                  fix(fixer) {
                    return fixer.replaceText(node.source, `'${expectedPath}'`);
                  },
                });
              }
            }
          }
        },
      };
    },
  }),
};

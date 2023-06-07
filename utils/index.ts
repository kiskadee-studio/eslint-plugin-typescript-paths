import { ESLintUtils } from '@typescript-eslint/utils';
import path from 'node:path';
import { existsSync } from 'node:fs';
import {
  findDirWithFile,
  getExpectedPath,
  getImportPrefixToAlias,
  getPaths,
} from './get-paths/get-paths';

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

type MessageIds =
  | 'relativeImport'
  | 'noRelativeImport'
  | 'noRelativeParentImport';

type Options = [
  {
    parentDirectory?: boolean;
    currentDirectory?: boolean;
  }
];

export const rules = {
  'relative-import': ESLintUtils.RuleCreator.withoutDocs<Options, MessageIds>({
    meta: {
      fixable: 'code',
      type: 'layout',
      messages: {
        relativeImport:
          'Absolute imports from the current directory are not allowed. Use "{{expectedPath}}"',
        noRelativeImport:
          'Relative imports from the current directory are not allowed. Use "{{expectedPath}}"',
        noRelativeParentImport:
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
            (checkDirectory || checkTypeScriptFiles) &&
            (enableCurrentDirectory || enableParentDirectory)
          ) {
            const expectedPath = getExpectedPath(
              absolutePath,
              baseUrl,
              importPrefixToAlias
              // onlyPathAliases,
              // onlyAbsoluteImports
            );

            const x = {
              source,
              expectedPath,
              absolutePath,
              exist: existsSync(absolutePath),
              baseUrl,
              importPrefixToAlias,
              importKind,
              // onlyPathAliases,
              // onlyAbsoluteImports,
            };

            if ((expectedPath && source !== expectedPath) || expectedPath) {
              context.report({
                node,
                // @ts-ignore
                // source,
                // messageId: enableCurrentDirectory
                //   ? 'noRelativeImport'
                //   : 'noRelativeParentImport',
                // data: { expectedPath },
                // @ts-ignore
                message: `Use \`${expectedPath}\` ---\`${JSON.stringify(
                  x
                )}\`--- instead of \`${source}\`.`,
                fix(fixer) {
                  return fixer.replaceText(node.source, `'${expectedPath}'`);
                },
              });
            }
          }
        },
      };
    },
  }),
};

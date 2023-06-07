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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ImportDeclaration(node: any): void {
          const source = node.source.value;
          const filename = context.getFilename();
          const absolutePath = path.normalize(
            path.join(path.dirname(filename), source)
          );

          const enableCurrentDirectory =
            source.startsWith('./') && currentDirectory;
          const enableParentDirectory =
            source.startsWith('../') && currentDirectory;

          if (
            existsSync(absolutePath) &&
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
              baseUrl,
              importPrefixToAlias,
              // onlyPathAliases,
              // onlyAbsoluteImports,
            };

            if ((expectedPath && source !== expectedPath) || expectedPath) {
              context.report({
                node,
                messageId: enableCurrentDirectory
                  ? 'noRelativeImport'
                  : 'noRelativeParentImport',
                data: { expectedPath },
                // message: `${errorMessagePrefix}. Use \`${expectedPath}\` ---\`${JSON.stringify(
                //   x
                // )}\`--- instead of \`${source}\`.`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fix(fixer: any) {
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

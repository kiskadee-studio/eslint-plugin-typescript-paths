import { ESLintUtils } from '@typescript-eslint/utils';
import { findDirWithFile, getPaths } from '@/utils/get-paths/get-paths';
import path from 'node:path';
import { checkAlias } from '@/utils/check-alias';
import { getExpectedPath } from '@/utils/get-expected-path';

type MessageIds = 'relativeImport' | 'absoluteImport';

type Options = [
  {
    currentDirectory?: boolean;
  }
];

export default ESLintUtils.RuleCreator.withoutDocs<Options, MessageIds>({
  meta: {
    fixable: 'code',
    type: 'suggestion',
    messages: {
      relativeImport:
        'Absolute imports are not encouraged when the files are in the same directory or below. Use just "{{expectedPath}}"',
      absoluteImport:
        'Relative imports from the current directory are not allowed. Use "{{expectedPath}}"',
    },
    docs: {
      description:
        'Controls whether the import can be relative or not to the current directory.',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          currentDirectory: {
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
    },
  ],
  create(context, [options]) {
    const baseDir = findDirWithFile('package.json');
    const [baseUrl, paths] = getPaths(baseDir);
    const { currentDirectory } = options;

    return {
      ImportDeclaration(node): void {
        const pathUsed = node.source.value;
        const filename = context.getFilename();
        const directoryName = path.dirname(filename);
        const absolutePath = path.join(directoryName, pathUsed);

        if (currentDirectory && pathUsed.startsWith('./')) {
          const expectedPath = getExpectedPath(absolutePath, baseUrl, paths);

          if (expectedPath && pathUsed !== expectedPath) {
            context.report({
              node,
              messageId: 'absoluteImport',
              data: { expectedPath },
              fix(fixer) {
                return fixer.replaceText(node.source, `'${expectedPath}'`);
              },
            });
          }
        } else {
          const alias = checkAlias(baseUrl, directoryName, pathUsed, paths);

          if (alias) {
            context.report({
              node,
              messageId: 'relativeImport',
              data: { expectedPath: alias },
              fix(fixer) {
                return fixer.replaceText(node.source, `'${alias}'`);
              },
            });
          }
        }
      },
    };
  },
});

import { ESLintUtils } from '@typescript-eslint/utils';
import { findDirWithFile, getPaths } from '@/utils/get-paths/get-paths';
import path from 'node:path';
import { checkAlias } from '@/utils/check-alias';
import { getExpectedPath } from '@/utils/get-expected-path';

type MessageIds = 'aliasImports' | 'relativeImports';

type Options = [
  {
    enableAlias?: boolean;
  }
];

export default ESLintUtils.RuleCreator.withoutDocs<Options, MessageIds>({
  meta: {
    fixable: 'code',
    type: 'suggestion',
    messages: {
      aliasImports:
        "1 - Alias imports are not encouraged when the files are in the same directory or below. Use just '{{expectedPath}}'.",
      relativeImports:
        "2 - Relative imports from the current directory are not allowed. Use '{{expectedPath}}' instead.",
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
          enableAlias: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [
    {
      enableAlias: false,
    },
  ],
  create(context, [{ enableAlias }]) {
    const baseDir = findDirWithFile('package.json');
    const [baseUrl, paths] = getPaths(baseDir);

    return {
      ImportDeclaration(node): void {
        const pathUsed = node.source.value;
        const filename = context.getFilename();
        const directoryName = path.dirname(filename);
        const absolutePath = path.join(directoryName, pathUsed);

        if (!enableAlias && pathUsed.startsWith('./')) {
          const expectedPath = getExpectedPath(absolutePath, baseUrl, paths);

          if (expectedPath && pathUsed !== expectedPath) {
            context.report({
              node,
              messageId: 'relativeImports',
              data: { expectedPath },
              fix(fixer) {
                return fixer.replaceText(node.source, `'${expectedPath}'`);
              },
            });
          }
        } else {
          const expectedPath = checkAlias(
            baseUrl,
            directoryName,
            pathUsed,
            paths
          );

          if (expectedPath) {
            context.report({
              node,
              messageId: 'aliasImports',
              data: { expectedPath },
              fix(fixer) {
                return fixer.replaceText(node.source, `'${expectedPath}'`);
              },
            });
          }
        }
      },
    };
  },
});

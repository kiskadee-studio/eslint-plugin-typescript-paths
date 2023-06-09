import { ESLintUtils } from '@typescript-eslint/utils';
import { getTSConfigPaths } from '@/utils/get-tsconfig-paths';
import { dirname, join } from 'node:path';
import { checkAlias } from '@/utils/check-alias';
import { getExpectedPath } from '@/utils/get-expected-path';
import { searchForFileDirectory } from '@/utils/search-for-file-directory';

type MessageIds =
  | 'relativeImportOverAlias'
  | 'aliasImportOverRelative'
  | 'baseUrlImportOverRelative';

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
      relativeImportOverAlias:
        "Use relative import for imports within the same directory for consistency. Use '{{expectedPath}}' instead.",
      aliasImportOverRelative:
        "Alias imports can also be used for imports within the same directory. Use '{{expectedPath}}' instead.",
      baseUrlImportOverRelative:
        "BaseUrl imports must be used over relative imports. Use '{{expectedPath}}' instead.",
    },
    docs: {
      description:
        'Controls whether the import can be absolute if the source is in the same directory or below.',
      recommended: 'warn',
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
    const rootDir = searchForFileDirectory('package.json');
    const config = getTSConfigPaths(rootDir);

    if (!config) {
      return {};
    }

    const { baseUrl, paths } = config;

    return {
      ImportDeclaration(node): void {
        const pathUsed = node.source.value;
        const filename = context.getFilename();
        const directoryName = dirname(filename);
        const absolutePath = join(directoryName, pathUsed);

        if (enableAlias && pathUsed.startsWith('./')) {
          const expectedPath = getExpectedPath(absolutePath, baseUrl, paths);

          if (expectedPath && pathUsed !== expectedPath) {
            const messageId =
              Object.keys(paths).length > 0
                ? 'aliasImportOverRelative'
                : 'baseUrlImportOverRelative';

            context.report({
              node,
              messageId,
              data: { expectedPath },
              fix(fixer) {
                return fixer.replaceText(node.source, `'${expectedPath}'`);
              },
            });
          }
        } else if (!enableAlias) {
          const expectedPath = checkAlias(
            baseUrl,
            directoryName,
            pathUsed,
            paths
          );

          if (expectedPath) {
            context.report({
              node,
              messageId: 'relativeImportOverAlias',
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

import { ESLintUtils } from '@typescript-eslint/utils';
import { getTSConfigPaths } from '@/utils/get-tsconfig-paths';
import { dirname, join } from 'node:path';
import { checkAlias } from '@/utils/check-alias';
import { getExpectedPath } from '@/utils/get-expected-path';
import { searchForFileDirectory } from '@/utils/search-for-file-directory';
import type { TSESTree } from '@typescript-eslint/utils/dist/ts-estree';
import type { RuleFunction } from '@typescript-eslint/utils/dist/ts-eslint/Rule';

type MessageIds =
  | 'relativeExportOverAlias'
  | 'aliasExportOverRelative'
  | 'baseUrlExportOverRelative';

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
      relativeExportOverAlias:
        "Use relative export for exports within the same directory for consistency. Use '{{expectedPath}}' instead.",
      aliasExportOverRelative:
        "Alias exports can also be used for exports within the same directory. Use '{{expectedPath}}' instead.",
      baseUrlExportOverRelative:
        "BaseUrl exports must be used over relative exports. Use '{{expectedPath}}' instead.",
    },
    docs: {
      description:
        'Controls whether the export can be absolute if the source is in the same directory or below.',
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

    const exportDeclaration: RuleFunction<
      TSESTree.ExportAllDeclaration | TSESTree.ExportNamedDeclaration
    > = (node): void => {
      if (node.source) {
        const pathUsed = node.source.value;
        const filename = context.getFilename();
        const directoryName = dirname(filename);
        const absolutePath = join(directoryName, pathUsed);

        if (enableAlias && pathUsed.startsWith('./')) {
          const expectedPath = getExpectedPath(absolutePath, baseUrl, paths);

          if (expectedPath && pathUsed !== expectedPath) {
            const messageId =
              Object.keys(paths).length > 0
                ? 'aliasExportOverRelative'
                : 'baseUrlExportOverRelative';

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
              messageId: 'relativeExportOverAlias',
              data: { expectedPath },
              fix(fixer) {
                return fixer.replaceText(node.source, `'${expectedPath}'`);
              },
            });
          }
        }
      }
    };

    return {
      ExportNamedDeclaration: exportDeclaration,
      ExportAllDeclaration: exportDeclaration,
    };
  },
});

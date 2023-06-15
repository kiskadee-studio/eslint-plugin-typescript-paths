import { ESLintUtils } from '@typescript-eslint/utils';
import { getTSConfigPaths } from '@/utils/get-tsconfig-paths';
import { dirname, join } from 'node:path';
import { checkAlias } from '@/utils/check-alias';
import { getExpectedPath } from '@/utils/get-expected-path';
import { searchForFileDirectory } from '@/utils/search-for-file-directory';

type MessageIds = 'relativeExportOverAlias' | 'aliasExportOverRelative';

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
    },
    docs: {
      description:
        'Controls whether the export can be relative or not to the current directory.',
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
    const rootDir = searchForFileDirectory('package.json');
    const config = getTSConfigPaths(rootDir);

    if (!config) {
      return {};
    }

    const { baseUrl, paths } = config;

    return {
      ExportNamedDeclaration(node): void {
        if (node.source) {
          const pathUsed = node.source.value;
          const filename = context.getFilename();
          const directoryName = dirname(filename);
          const absolutePath = join(directoryName, pathUsed);

          if (enableAlias && pathUsed.startsWith('./')) {
            const expectedPath = getExpectedPath(absolutePath, baseUrl, paths);

            if (expectedPath && pathUsed !== expectedPath) {
              context.report({
                node,
                messageId: 'aliasExportOverRelative',
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
      },
    };
  },
});

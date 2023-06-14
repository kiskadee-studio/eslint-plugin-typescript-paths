import { ESLintUtils } from '@typescript-eslint/utils';
import { findDirWithFile, getTSConfigPaths } from '@/utils/get-tsconfig-paths';
import path from 'node:path';
import { checkAlias } from '@/utils/check-alias';
import { getExpectedPath } from '@/utils/get-expected-path';

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
        "Prefer relative exports over alias exports. Use '{{expectedPath}}' instead.",

      aliasExportOverRelative:
        "Prefer alias exports over relative exports. Use '{{expectedPath}}' instead.",
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
    const rootDir = findDirWithFile('package.json');
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
          const directoryName = path.dirname(filename);
          const absolutePath = path.join(directoryName, pathUsed);

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

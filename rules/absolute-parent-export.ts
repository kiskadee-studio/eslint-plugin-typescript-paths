import { ESLintUtils } from '@typescript-eslint/utils';
import { getTSConfigPaths } from '@/utils/get-tsconfig-paths';
import { posix, dirname, join } from 'node:path';
import { getExpectedPath } from '@/utils/get-expected-path';
import { checkPathExistence } from 'utils/check-path-existence';
import { searchForFileDirectory } from '@/utils/search-for-file-directory';

type MessageIds =
  | 'aliasExportOverRelative'
  | 'aliasExportOverBaseUrl'
  | 'baseUrlExportOverRelative';

type Options = [
  {
    preferPathOverBaseUrl?: boolean;
  }
];

export default ESLintUtils.RuleCreator.withoutDocs<Options, MessageIds>({
  meta: {
    fixable: 'code',
    type: 'suggestion',
    messages: {
      aliasExportOverRelative:
        "Alias exports must be used over parent relative exports. Use '{{expectedPath}}' instead.",
      aliasExportOverBaseUrl:
        "Alias exports must be used over baseUrl exports. Use '{{expectedPath}}' instead.",
      baseUrlExportOverRelative:
        "BaseUrl exports must be used over parent relative exports. Use '{{expectedPath}}' instead.",
    },
    docs: {
      description:
        'Encourages the use of absolute exports for parent directories.',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          preferPathOverBaseUrl: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [
    {
      preferPathOverBaseUrl: true,
    },
  ],
  create(context, [{ preferPathOverBaseUrl }]) {
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

          if (pathUsed.startsWith('../')) {
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
          } else if (!pathUsed.startsWith('./') && preferPathOverBaseUrl) {
            const relativeToBaseUrl = posix.join(baseUrl, pathUsed);

            if (checkPathExistence(relativeToBaseUrl)) {
              const expectedPath = getExpectedPath(
                relativeToBaseUrl,
                baseUrl,
                paths
              );

              if (expectedPath && pathUsed !== expectedPath) {
                context.report({
                  node,
                  messageId: 'aliasExportOverBaseUrl',
                  data: { expectedPath },
                  fix(fixer) {
                    return fixer.replaceText(node.source, `'${expectedPath}'`);
                  },
                });
              }
            }
          }
        }
      },
    };
  },
});

import { ESLintUtils } from '@typescript-eslint/utils';
import { getTSConfigPaths } from '@/utils/get-tsconfig-paths';
import { posix, dirname, join } from 'node:path';
import { getExpectedPath } from '@/utils/get-expected-path';
import { checkPathExistence } from 'utils/check-path-existence';
import { searchForFileDirectory } from '@/utils/search-for-file-directory';

type MessageIds =
  | 'aliasImportOverRelative'
  | 'aliasImportOverBaseUrl'
  | 'baseUrlImportOverRelative';

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
      aliasImportOverRelative:
        "3 - Alias imports must be used over parent relative imports. Use '{{expectedPath}}' instead.",
      aliasImportOverBaseUrl:
        "4 - Alias imports must be used over baseUrl imports. Use '{{expectedPath}}' instead.",
      baseUrlImportOverRelative:
        "5 - BaseUrl imports must be used over parent relative imports. Use '{{expectedPath}}' instead.",
    },
    docs: {
      description:
        'Encourages the use of absolute imports for parent directories.',
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
      ImportDeclaration(node): void {
        const pathUsed = node.source.value;
        const filename = context.getFilename();
        const directoryName = dirname(filename);
        const absolutePath = join(directoryName, pathUsed);

        if (pathUsed.startsWith('../')) {
          const expectedPath = getExpectedPath(absolutePath, baseUrl, paths);

          if (expectedPath && pathUsed !== expectedPath) {
            context.report({
              node,
              messageId: 'aliasImportOverRelative',
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
                messageId: 'aliasImportOverBaseUrl',
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

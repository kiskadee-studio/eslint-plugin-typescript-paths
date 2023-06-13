import { ESLintUtils } from '@typescript-eslint/utils';
import { findDirWithFile, getPaths } from '@/utils/get-paths/get-paths';
import path from 'node:path';
import { getExpectedPath } from '@/utils/get-expected-path';
import { checkPathExistence } from '@/utils/check-path-existance';

type MessageIds =
  | 'aliasOverRelative'
  | 'aliasOverBaseUrl'
  | 'baseUrlOverRelative';

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
      aliasOverRelative:
        "Prefer alias exports over relative exports. Use '{{expectedPath}}' instead.",
      aliasOverBaseUrl:
        "Prefer alias exports over baseUrl exports. Use '{{expectedPath}}' instead.",
      baseUrlOverRelative:
        "Prefer baseUrl exports over relative exports. Use '{{expectedPath}}' instead.",
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
    const baseDir = findDirWithFile('package.json');
    const [baseUrl, paths] = getPaths(baseDir);

    return {
      ExportNamedDeclaration(node): void {
        if (node.source) {
          const pathUsed = node.source.value;
          const filename = context.getFilename();
          const directoryName = path.dirname(filename);
          const absolutePath = path.join(directoryName, pathUsed);

          if (pathUsed.startsWith('../')) {
            const expectedPath = getExpectedPath(absolutePath, baseUrl, paths);

            if (expectedPath && pathUsed !== expectedPath) {
              context.report({
                node,
                messageId: 'aliasOverRelative',
                data: { expectedPath },
                fix(fixer) {
                  return fixer.replaceText(node.source, `'${expectedPath}'`);
                },
              });
            }
          } else if (!pathUsed.startsWith('./') && preferPathOverBaseUrl) {
            const relativeToBaseUrl = path.posix.join(baseUrl, pathUsed);

            if (checkPathExistence(relativeToBaseUrl)) {
              const expectedPath = getExpectedPath(
                relativeToBaseUrl,
                baseUrl,
                paths
              );

              if (expectedPath && pathUsed !== expectedPath) {
                context.report({
                  node,
                  messageId: 'aliasOverBaseUrl',
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
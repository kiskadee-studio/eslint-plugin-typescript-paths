import { ESLintUtils } from '@typescript-eslint/utils';
import { findDirWithFile, getPaths } from '@/utils/get-paths/get-paths';
import path from 'node:path';
import { getExpectedPath } from '@/utils/get-expected-path';
import { checkPathExistence } from '@/utils/check-path-existance';

type MessageIds = 'relativeParentImports' | 'baseUrlImports';

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
      relativeParentImports:
        "3 - Relative parent imports are not allowed. Use '{{expectedPath}}' instead.",
      baseUrlImports:
        "4 - Using aliases is recommended over baseUrl. Use '{{expectedPath}}' instead.",
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
    const baseDir = findDirWithFile('package.json');
    const [baseUrl, paths] = getPaths(baseDir);

    return {
      ImportDeclaration(node): void {
        const pathUsed = node.source.value;
        const filename = context.getFilename();
        const directoryName = path.dirname(filename);
        const absolutePath = path.join(directoryName, pathUsed);

        if (pathUsed.startsWith('../')) {
          const expectedPath = getExpectedPath(absolutePath, baseUrl, paths);

          if (expectedPath && pathUsed !== expectedPath) {
            context.report({
              node,
              messageId: 'relativeParentImports',
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
                messageId: 'baseUrlImports',
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

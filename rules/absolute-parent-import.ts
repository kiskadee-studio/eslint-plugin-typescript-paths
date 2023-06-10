import { ESLintUtils } from '@typescript-eslint/utils';
import { findDirWithFile, getPaths } from '@/utils/get-paths/get-paths';
import path from 'node:path';
import { getExpectedPath } from '@/utils/get-expected-path';
import { convertToUnixPath } from '@/utils/convert-to-unix-path';
import { checkPathExistence } from '@/utils/check-path-existance';

type MessageIds = 'absoluteParentImport' | 'baseUrlUsage';

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
      absoluteParentImport: '{{log}}. Use "{{expectedPath}}"',
      baseUrlUsage:
        'Use alias instead of baseUrl {{log}}. Use {{expectedPath}}',
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
  create(context) {
    const baseDir = findDirWithFile('package.json');
    const [baseUrl, paths] = getPaths(baseDir);
    // const importPrefixToAlias = getImportPrefixToAlias(paths);

    return {
      ImportDeclaration(node): void {
        const pathUsed = node.source.value;
        const filename = context.getFilename();
        const directoryName = path.dirname(filename);
        const absolutePath = path.join(directoryName, pathUsed);

        const firstTwoDirectories = pathUsed.split('/').slice(0, 2).join('/');

        const regex = new RegExp(firstTwoDirectories.replaceAll('/', '\\/'));
        const exists = regex.test(directoryName);
        // const slashCount = pathUsed.split('/').length - 1;

        // if (pathUsed.startsWith('../') || slashCount >= 2) {
        if (pathUsed.startsWith('../')) {
          const expectedPath = getExpectedPath(absolutePath, baseUrl, paths);

          const log = {
            firstTwoDirectories,
            exists,
            directoryName: convertToUnixPath(directoryName),
            pathUsed,
            absolutePath,
            baseUrl,
            paths,
          };

          if (expectedPath && pathUsed !== expectedPath) {
            context.report({
              node,
              messageId: 'absoluteParentImport',
              data: { expectedPath, log: JSON.stringify(log) },
              fix(fixer) {
                return fixer.replaceText(node.source, `'${expectedPath}'`);
              },
            });
          }
        } else if (!pathUsed.startsWith('./')) {
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
                messageId: 'baseUrlUsage',
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

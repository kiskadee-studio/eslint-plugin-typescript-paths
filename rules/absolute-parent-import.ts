import { ESLintUtils } from '@typescript-eslint/utils';
import { findDirWithFile, getPaths } from '@/utils/get-paths/get-paths';
import path from 'node:path';
import { getExpectedPath } from '@/utils/get-expected-path';

type MessageIds = 'absoluteParentImport';

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

        // const slashCount = pathUsed.split('/').length - 1;

        // ESLint: {"absolutePath":"C:\\Users\\rodri\\projects\\desafio-frontend-web\\components\\Header","baseUrl":"C:\\Users\\rodri\\projects\\desafio-frontend-web","paths":{"@/*":["*","src/*"],"@request/*":["*","src/request/*"]}}. Use "*/components/Header"(typescript-paths/absolute-parent-import)

        // if (pathUsed.startsWith('../') || slashCount >= 2) {
        if (pathUsed.startsWith('../')) {
          const expectedPath = getExpectedPath(absolutePath, baseUrl, paths);

          const log = {
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
        }
      },
    };
  },
});

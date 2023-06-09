import { ESLintUtils } from '@typescript-eslint/utils';
import {
  findDirWithFile,
  getExpectedPath,
  getImportPrefixToAlias,
  getPaths,
} from '@/utils/get-paths/get-paths';
import path from 'node:path';

type MessageIds = 'absoluteParentImport';

export default ESLintUtils.RuleCreator.withoutDocs<
  [Record<string, never>],
  MessageIds
>({
  meta: {
    fixable: 'code',
    type: 'suggestion',
    messages: {
      absoluteParentImport:
        'Relative imports from parent directories are not allowed. Use "{{expectedPath}}"',
    },
    docs: {
      description:
        'Encourages the use of absolute imports for parent directories.',
      recommended: false,
    },
    schema: [
      {
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context) {
    const baseDir = findDirWithFile('package.json');
    const [baseUrl, paths] = getPaths(baseDir);
    const importPrefixToAlias = getImportPrefixToAlias(paths);

    return {
      ImportDeclaration(node): void {
        const pathUsed = node.source.value;
        const filename = context.getFilename();
        const directoryName = path.dirname(filename);
        const absolutePath = path.join(directoryName, pathUsed);

        if (pathUsed.startsWith('../')) {
          const expectedPath = getExpectedPath(
            absolutePath,
            baseUrl,
            importPrefixToAlias
          );

          if (expectedPath && pathUsed !== expectedPath) {
            context.report({
              node,
              messageId: 'absoluteParentImport',
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

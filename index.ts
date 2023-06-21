import absoluteImport from '@/rules/absolute-import';
import absoluteExport from '@/rules/absolute-export';
import absoluteParentImport from '@/rules/absolute-parent-import';
import absoluteParentExport from '@/rules/absolute-parent-export';

export default {
  meta: {
    name: 'eslint-plugin-typescript-paths',
    version: '0.0.1',
  },
  configs: {
    recommended: {
      plugins: ['typescript-paths'],
      rules: {
        'typescript-paths/absolute-import': 'warn',
        'typescript-paths/absolute-export': 'warn',
        'typescript-paths/absolute-parent-import': 'warn',
        'typescript-paths/absolute-parent-export': 'warn',
      },
    },
  },
  rules: {
    'absolute-import': absoluteImport,
    'absolute-export': absoluteExport,
    'absolute-parent-import': absoluteParentImport,
    'absolute-parent-export': absoluteParentExport,
  },
};

// eslint-disable-next-line import/extensions
import packageJson from './package.json';
import absoluteImport from './rules/absolute-import';
import absoluteExport from './rules/absolute-export';
import absoluteParentExport from './rules/absolute-parent-export';
import absoluteParentImport from './rules/absolute-parent-import';

export = {
  meta: {
    name: packageJson.name,
    version: packageJson.version,
  },
  rules: {
    'absolute-import': absoluteImport,
    'absolute-export': absoluteExport,
    'absolute-parent-import': absoluteParentImport,
    'absolute-parent-export': absoluteParentExport,
  },
  configs: {
    recommended: {
      plugins: ['typescript-paths'],
      rules: {
        'typescript-paths/absolute-import': ['warn', { enableAlias: false }],
        'typescript-paths/absolute-export': ['warn', { enableAlias: false }],
        'typescript-paths/absolute-parent-import': [
          'warn',
          { preferPathOverBaseUrl: true },
        ],
        'typescript-paths/absolute-parent-export': [
          'warn',
          { preferPathOverBaseUrl: true },
        ],
      },
    },
  },
};

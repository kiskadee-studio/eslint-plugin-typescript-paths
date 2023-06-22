import absoluteImport from '@/rules/absolute-import';
import absoluteExport from '@/rules/absolute-export';
import absoluteParentImport from '@/rules/absolute-parent-import';
import absoluteParentExport from '@/rules/absolute-parent-export';
// eslint-disable-next-line import/extensions
import packageJson from '@/package.json';

export default {
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
};

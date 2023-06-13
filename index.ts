import absoluteImport from '@/rules/absolute-import';
import absoluteExport from '@/rules/absolute-export';
import absoluteParentImport from '@/rules/absolute-parent-import';
import absoluteParentExport from '@/rules/absolute-parent-export';

export const rules = {
  'absolute-import': absoluteImport,
  'absolute-parent-import': absoluteParentImport,
  'absolute-export': absoluteExport,
  'absolute-parent-export': absoluteParentExport,
};

// eslint-disable-next-line import/no-extraneous-dependencies
import { RuleTester } from '@typescript-eslint/rule-tester';
// eslint-disable-next-line typescript-paths/absolute-parent-import
import rule from '../rules/absolute-parent-import';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectServices: {
        allowDefaultProject: ['*.ts'],
        defaultProject: 'tsconfig.json',
      },
      tsconfigRootDir: '../',
    },
  },
});

ruleTester.run('absolute-parent-import', rule, {
  valid: [
    {
      code: `import { checkAlias } from '../utils/check-alias';`,
    },
  ],
  invalid: [],
});

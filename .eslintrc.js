module.exports = {
  extends: ['kiskadee/node-level-3'],
  ignorePatterns: ['dist'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.js', '**/*.config.*', './rules/**'] },
    ],
  },
};

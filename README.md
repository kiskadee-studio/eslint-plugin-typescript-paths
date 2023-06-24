#### Installation

```bash
npm i -D eslint-plugin-typescript-paths
```

## Requirements

It is recommended that you have already set up [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import#typescript), [@typescript-eslint](https://typescript-eslint.io/getting-started/#step-2-configuration) and [eslint-import-resolver-typescript](https://github.com/import-js/eslint-import-resolver-typescript) in your project beforehand.

Alternatively, you can simply use a ***level 2*** [Kiskadee setup](https://github.com/kiskadee-studio/eslint-config-kiskadee) that already includes all the prerequisite configuration and additionally supports this plugin.

#### Usage

To use the recommended rules, in the `.eslintrc` ([or equivalent](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file-formats))  file, extend `plugin:typescript-paths/recommended`.

```javascript
  module.exports = {
    extends: ['plugin:typescript-paths/recommended'],
    rules: {
      // your rules
    },
  };
```

If you want to customize the rules, define 'typescript-paths' plugin.

```javascript
  module.exports = {
    plugins: ['typescript-paths'],
    rules: {
      // your rules
    },
  };
```

### Regras

## absolute-import

Controls whether the import can be absolute if the source is in the same directory.

#### Options

- **enableAlias**: `boolean`. Default: `false`. If `true`, the use of absolute import will be recommended even if the source is from the same directory or below.

```javascript
  // .eslintrc
  module.exports = {
    rules: {
      'typescript-paths/absolute-import': 'warn'
      // 'typescript-paths/absolute-import': ['warn', { enableAlias: false } ]
    },
  };
```

## absolute-export

Controls whether the export can be absolute if the source is in the same directory or below.

#### Options

- **enableAlias**: `boolean`. Default: `false`. If `true`, the use of absolute export will be recommended even if the source is from the same directory or below.

```javascript
  // .eslintrc
  module.exports = {
    rules: {
      'typescript-paths/absolute-export': 'warn'
      // 'typescript-paths/absolute-export': ['warn', { enableAlias: false } ]
    },
  };
```

## absolute-parent-import

Encourages the use of absolute imports from parent directories.

#### Options

- **preferPathOverBaseUrl**: `boolean`. Default: `true`. If `false`, it stops suggesting the use of aliases and starts accepting imports from the source baseUrl as well.

```javascript
  // .eslintrc
  module.exports = {
    rules: {
      'typescript-paths/absolute-parent-import': 'warn'
      // 'typescript-paths/absolute-parent-import': ['warn', { preferPathOverBaseUrl: true } ]
    },
  };
```

## absolute-parent-export

Encourages the use of absolute exports from parent directories.

#### Options

- **preferPathOverBaseUrl**: `boolean`. Default: `true`. If `false`, it stops suggesting the use of aliases and starts accepting exports from the source baseUrl as well.

```javascript
  // .eslintrc
  module.exports = {
    rules: {
      'typescript-paths/absolute-parent-export': 'warn'
      // 'typescript-paths/absolute-parent-export': ['warn', { preferPathOverBaseUrl: true } ]
    },
  };
```

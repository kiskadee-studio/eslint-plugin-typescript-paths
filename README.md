## Description

**ESLint Rules** that enables the *automatic fixing* of relative paths to absolute paths based on the [paths](https://www.typescriptlang.org/tsconfig#paths) or [baseUrl](https://www.typescriptlang.org/tsconfig#baseUrl) from [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

## Motivation

After unsuccessful attempts to adopt aliases as a standard in my projects and trying to use other plugins with the same purpose but none of them working as expected, either due to bugs, lack of resources, or simply lack of support for Windows, I wanted to do something better. I wanted to create something that was tested, with more features that could not only help me in future projects but also help others who had faced the same problems as me.

## Installation

```bash
npm i -D eslint-plugin-typescript-paths
```

## Requirements

It is recommended that you have already set up [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import#typescript), [@typescript-eslint](https://typescript-eslint.io/getting-started/#step-2-configuration) and [eslint-import-resolver-typescript](https://github.com/import-js/eslint-import-resolver-typescript) in your project.

Alternatively, you can simply use a ***level 2 configuration*** from [Kiskadee ESLint Setup](https://github.com/kiskadee-studio/eslint-config-kiskadee) that already includes all the prerequisite configuration and additionally supports this plugin.

## Usage

To use the recommended rules, in the `.eslintrc` ([or equivalent](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file-formats))  file, extend `plugin:typescript-paths/recommended`.

```javascript
  module.exports = {
    extends: ['plugin:typescript-paths/recommended'],
    rules: {
      // your rules
    },
  };
```

If you want to customize the rules, define `typescript-paths` plugin.

```javascript
  module.exports = {
    plugins: ['typescript-paths'],
    rules: {
      // your rules
    },
  };
```

### Rules

## absolute-import

Controls whether the import can be absolute if the source is in the same directory.

#### Options

- **enableAlias**: `boolean`.

```javascript
  // .eslintrc
  module.exports = {
    rules: {
      'typescript-paths/absolute-import': 'warn'
      // short for: 'typescript-paths/absolute-import': ['warn', { enableAlias: false } ]
    },
  };
```

### enableAlias: true

Encourages the use of aliases for imports even from the same directory or subdirectories.

#### ❌ Fail

```javascript
  import functionA from './function-a'
  import functionB from './service/function-b'
```

#### ✅ Pass

```javascript
  import functionA from '@/path/current-dir/function-a'
  import functionB from '@/path/current-dir/service/function-b'
```

### enableAlias: false (default)

Discourages the use of aliases for imports from the same directory or subdirectories.

#### ❌ Fail

```javascript
  import functionA from '@/function-a'
  import functionB from 'service/function-b'
```

#### ✅ Pass

```javascript
  import functionA from './function-a'
  import functionB from './service/function-b'
```

## absolute-export

Controls whether the export can be absolute if the source is in the same directory.

#### Options

- **enableAlias**: `boolean`.

```javascript
  // .eslintrc
  module.exports = {
    rules: {
      'typescript-paths/absolute-export': 'warn'
      // short for: 'typescript-paths/absolute-export': ['warn', { enableAlias: false } ]
    },
  };
```

### enableAlias: true

Encourages the use of aliases for exports even from the same directory or subdirectories.

#### ❌ Fail

```javascript
  export functionA from './function-a'
  export functionB from './service/function-b'
```

#### ✅ Pass

```javascript
  export functionA from '@/path/current-dir/function-a'
  export functionB from '@/path/current-dir/service/function-b'
```

### enableAlias: false (default)

Discourages the use of aliases for exports from the same directory or subdirectories.

#### ❌ Fail

```javascript
  export functionA from '@/function-a'
  export functionB from 'service/function-b'
```

#### ✅ Pass

```javascript
  export functionA from './function-a'
  export functionB from './service/function-b'
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

### tsconfig.json example

```json lines
  // tsconfig.json
  {
    "compilerOptions": {
      "baseUrl": "./src", // default is "./*"
      "paths": [{ "service/*": "./service/*", "@/*": "./*" }]
    }
  }
```

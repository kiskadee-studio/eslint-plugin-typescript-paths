<p align="center">
  <img alt="npm" src="https://img.shields.io/npm/dw/eslint-plugin-typescript-paths">
  <img alt="GitHub" src="https://img.shields.io/github/license/kiskadee-studio/eslint-plugin-typescript-paths">
  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/eslint-plugin-typescript-paths">
  <img alt="npm" src="https://img.shields.io/npm/v/eslint-plugin-typescript-paths">
  <img alt="GitHub Release Date - Published_At" src="https://img.shields.io/github/release-date/kiskadee-studio/eslint-plugin-typescript-paths">
</p>

## 📖 Description

**_ESLint Plugin_** that includes rules which **_encourage the use of absolute paths_** over relative paths, defined by [paths](https://www.typescriptlang.org/tsconfig#paths) or [baseUrl](https://www.typescriptlang.org/tsconfig#baseUrl) from [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

## 🗂️ Summary

- [Installation](https://github.com/kiskadee-studio/eslint-plugin-typescript-paths/tree/master#-installation)
- [Requirements](https://github.com/kiskadee-studio/eslint-plugin-typescript-paths/tree/master#-requirements)
- [Usage](https://github.com/kiskadee-studio/eslint-plugin-typescript-paths/tree/master#-usage)
- Frameworks
  - [TypeScript (tsc)](https://github.com/kiskadee-studio/eslint-plugin-typescript-paths/tree/master#typescript-tsc)
  - [Vite / Vitest](https://github.com/kiskadee-studio/eslint-plugin-typescript-paths/tree/master#vite--vitest)
  - [Next.js](https://github.com/kiskadee-studio/eslint-plugin-typescript-paths/tree/master#nextjs)
  - Gatsby - soon
  - Webpack - soon
- Rules
  - [absolute-import](https://github.com/kiskadee-studio/eslint-plugin-typescript-paths/tree/master#-absolute-import---rule)
  - [absolute-export](https://github.com/kiskadee-studio/eslint-plugin-typescript-paths/tree/master#-absolute-export---rule)
  - [absolute-parent-import](https://github.com/kiskadee-studio/eslint-plugin-typescript-paths/tree/master#-absolute-parent-import---rule)
  - [absolute-parent-export](https://github.com/kiskadee-studio/eslint-plugin-typescript-paths/tree/master#-absolute-parent-export---rule)

---

## 🎒 Installation

In your **terminal**, run the command below:

```bash
npm i -D eslint-plugin-typescript-paths
```

<div align="right">[ <a href="#-description">↑ Back to top ↑</a> ]</div>

---

## 🧩 Requirements

It is recommended that you have already set up [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import#typescript), [@typescript-eslint](https://typescript-eslint.io/getting-started/#step-2-configuration) and [eslint-import-resolver-typescript](https://github.com/import-js/eslint-import-resolver-typescript) in your project.

Alternatively, you can simply use a ***level 2 configuration*** from [Kiskadee ESLint Setup](https://github.com/kiskadee-studio/eslint-config-kiskadee) that already includes all the prerequisite configuration and additionally supports this plugin.

<div align="right">[ <a href="#-description">↑ Back to top ↑</a> ]</div>

---

## 🪁 Usage

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

##### 🔵 TSConfig.json

Your project requires a tsconfig.json. Despite the plugin's capability to function without specified paths or a baseUrl in the tsconfig.json, we utilize the default baseUrl, "./". This allows us to provide suggestions for absolute paths, or not, as needed. However, without a tsconfig.json file, the plugin simply won't operate.

```jsonc
  // tsconfig.json
  {
    "compilerOptions": {
      "baseUrl": "./",
      "paths": [{
        "app/*": ["./src/app/*"],
        "config/*": ["./src/app/_config/*"],
        "environment/*": ["./src/environments/*"],
        "shared/*": ["./src/app/_shared/*"],
        "helpers/*": ["./src/helpers/*"],
        "tests/*": ["./src/tests/*"],
        "@/*": ["./src/*"],
      }]
    }
  }
```

> Keep in mind that the `./` origin used in `paths` is relative to the `baseUrl`. Using the above example as reference, it would be possible to set baseUrl as `./src`, and paths as `"app/*": ["./app/*"]`.

##### 🔵 Node Absolute Paths

Node.js interprets absolute imports based on **_the location of the file being executed_**. That is, if you start an import with `/`, it will consider the root of the filesystem as the starting point. This can be confusing, as in many other environments, such as the web and some JavaScript transpilers like Babel, an import starting with `/` refers to the root of the project.

##### ❌ Avoid using this

```typescript
  import logo from '/img/logo.svg';
  import Helvetica from '/fonts/Helvetica.woff';
```

Some frameworks have a `public` directory, to which you could make absolute imports. However, **_this is not encouraged_**. To maintain consistency with EcmaScript and TypeScript, **_it is highly recommended that you create a path (alias)_** to this public folder instead, as shown in the following example:

##### ✅ Suggested usage

```jsonc
  // tsconfig.json
  {
    "compilerOptions": {
      "baseUrl": "./",
      "paths": [{
        "public/*": "./public/*",
        "@/*": "./src/*",
      }]
    }
  }
```

```typescript
  import logo from 'public/img/logo.svg';
  import Helvetica from 'public/fonts/Helvetica.woff';
  // or
  import logo from '@/img/logo.svg';
  import Helvetica from '@/fonts/Helvetica.woff';
```

> The example above is just a suggestion in case you want to keep the 'public' directory, nothing prevents you from using it inside 'src' or changing its name. Don't get attached to our alias names in the examples, they are not recommendations, just examples. Use the aliases with which you feel most comfortable

## Frameworks

Despite its configuration option in tsconfig.json, it's ironic that TypeScript doesn't have native support for aliases. Nevertheless, third-party tools are necessary to enable this feature. Below is a list of frameworks that support aliases and how to configure them.

### 🔵 TypeScript (tsc)

##### Installation

```bash
npm i -D tsc-alias
```

##### Usage

```jsonc
  // package.json
  {
    "scripts": {
      "build": "tsc --project tsconfig.json && tsc-alias -p tsconfig.json",
    }
  }
```

### 🔵 Vite / Vitest

##### Installation

```bash
npm i -D vite-tsconfig-paths
```

##### Usage

```javascript
  // vite.config.js
  import { defineConfig } from 'vite';
  import tsconfigPaths from 'vite-tsconfig-paths';
  
  export default defineConfig({
    plugins: [tsconfigPaths()],
  });
```

```javascript
  // vitest.config.js
  import { defineConfig } from 'vitest/config';
  import tsconfigPaths from 'vite-tsconfig-paths';

  export default defineConfig({
    plugins: [tsconfigPaths()],
  });
```

### 🔵 Next.js

Next.js has [in-built support](https://nextjs.org/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases) for the "paths" and "baseUrl" options of `tsconfig.json` and `jsconfig.json` files.

### 🔵 Gatsby

soon

### 🔵 Webpack

soon

<div align="right">[ <a href="#-description">↑ Back to top ↑</a> ]</div>

---

## 🔥 absolute-import - rule

Controls whether the import can be absolute if the source is in the same directory.

**Options:**

- **enableAlias**: `boolean`

```javascript
  // .eslintrc
  module.exports = {
    rules: {
      'typescript-paths/absolute-import': 'warn'
      // short for: 'typescript-paths/absolute-import': ['warn', { enableAlias: false } ]
    },
  };
```

#### 🔵 enableAlias: `true`

Encourages the use of aliases for imports even from the same directory or subdirectories.

##### ❌ Fail

```typescript
  import functionA from './function-a';
  import functionB from './path-2/function-b';
  import functionC from './path-1/path-3/function-c';
```

##### ✅ Pass

```typescript
  import functionA from '@/path/CURRENT-DIR/function-a';
  import functionB from '@/path/CURRENT-DIR/path-2/function-b';
  import functionC from '@/path/CURRENT-DIR/path-1/path-3/function-c';
```

#### enableAlias: `false` (default)

Discourages the use of aliases for imports from the same directory or subdirectories.

##### ❌ Fail

```javascript
  import functionA from '@/path/CURRENT-DIR/function-a';
  import functionB from '@/path/CURRENT-DIR/path-2/function-b';
  import functionC from '@/path/CURRENT-DIR/path-1/path-3/function-c';
```

##### ✅ Pass

```javascript
  import functionA from './function-a';
  import functionB from './path-2/function-b';
  import functionC from './path-1/path-3/function-c';
```

<div align="right">[ <a href="#-description">↑ Back to top ↑</a> ]</div>

---

## 🔥 absolute-export - rule

Controls whether the export can be absolute if the source is in the same directory.

**Options**

- **enableAlias**: `boolean`

```javascript
  // .eslintrc
  module.exports = {
    rules: {
      'typescript-paths/absolute-export': 'warn'
      // short for: 'typescript-paths/absolute-export': ['warn', { enableAlias: false } ]
    },
  };
```

#### 🔵 enableAlias: `true`

Encourages the use of aliases for exports even from the same directory or subdirectories.

##### ❌ Fail

```javascript
  export functionA from './function-a';
  export { functionB } from './path-2/function-b';
  export * from './path-1/path-3/function-c';
```

##### ✅ Pass

```javascript
  export functionA from '@/path/CURRENT-DIR/function-a';
  export { functionB } from '@/path/CURRENT-DIR/path-2/function-b';
  export * from '@/path/CURRENT-DIR/path-1/path-3/function-c';
```

#### 🔵 enableAlias: `false` (default)

Discourages the use of aliases for exports from the same directory or subdirectories.

###### ❌ Fail

```javascript
  export functionA from '@/path/CURRENT-DIR/function-a';
  export { functionB } from '@/path/CURRENT-DIR/path-2/function-b';
  export * from '@/path/CURRENT-DIR/path-1/path-3/function-c';
```

##### ✅ Pass

```javascript
  export functionA from './function-a';
  export { functionB } from './path-2/function-b';
  export * from './path-1/path-3/function-c';
```

<div align="right">[ <a href="#-description">↑ Back to top ↑</a> ]</div>

## 🔥 absolute-parent-import - rule

Encourages the use of absolute imports from parent directories.

**Options:**

- **preferPathOverBaseUrl**: `boolean`

**Usage**:

```javascript
  // .eslintrc
  module.exports = {
    rules: {
      'typescript-paths/absolute-parent-import': 'warn'
      // short for: 'typescript-paths/absolute-parent-import': ['warn', { preferPathOverBaseUrl: true } ]
    },
  };
```

#### 🔵 preferPathOverBaseUrl: `true` (default)

Encourages the use of `paths` (aliases) defined in the `tsconfig.json` file instead of importing modules using the `baseUrl` attribute.

##### ❌ Fail

```jsonc
  // tsconfig.json
  {
    "compilerOptions": {
      "baseUrl": "./src", // default is "./*"
      "paths": [{}]
    }
  }
```

```javascript
  // relative parent imports
  import functionA from '../function-a';
  import functionB from '../../service/function-b';
  import functionC from '../../helper/util/path/function-c';

  // baseUrl imports
  import functionD from 'config/function-d';
  import functionE from 'service/function-e';
  import functionF from 'helper/util/path/function-f';
```

##### ✅ Pass

```jsonc
  // tsconfig.json
  {
    "compilerOptions": {
      "baseUrl": "./src", // default is "./"
      "paths": [{
        "@/*": "./*"
      }]
    }
  }
```

```javascript
  import functionA from '@/config/function-a';
  import functionB from '@/service/function-b';
  import functionC from '@/helper/util/path/function-c';
```

##### ✅ Pass

```jsonc
  // tsconfig.json
  {
    "compilerOptions": {
      "baseUrl": "./src", // default is "./*"
      "paths": [{
        "util/*": "./helpers/utils/*",
        "@service/*": "./service/*",
        "@/*": "./*" // the most generic path should be the last
      }]
    }
  }
```

```javascript
  import { functionA } from '@/config';
  import functionB from '@service/function-b';
  import functionC from 'util/path/function-c';
```

#### 🔵 preferPathOverBaseUrl: `false`

Encourages the use of `paths` (aliases) **if defined** in the `tsconfig.json` file, otherwise allows and suggests the use of absolute imports using the `baseUrl` attribute.

##### ❌ Fail

```javascript
  // relative parent imports
  import functionA from '../function-a';
  import functionB from '../../service/function-b';
  import functionC from '../../helper/util/path/function-c';
```

##### ✅ Pass

```jsonc
  // tsconfig.json
  {
    "compilerOptions": {
      "baseUrl": "./src", // default is "./*"
      "paths": [{}]
    }
  }
```

```javascript
  // baseUrl imports
  import functionA from 'config/function-a';
  import functionB from 'service/function-b';
  import functionC from 'helper/util/path/function-c';
```

##### ✅ Pass

```jsonc
  // tsconfig.json
  {
    "compilerOptions": {
      "baseUrl": "./src", // default is "./*"
      "paths": [{
        "@/*": "./*"
      }]
    }
  }
```

```javascript
  // baseUrl imports
  import functionA from 'function-a';
  import functionB from 'service/function-b';
  import functionC from 'helper/util/path/function-c';

  // paths imports
  import functionD from '@/function-d';
  import functionE from '@/service/function-e';
  import functionF from '@/helper/util/path/function-f';
```

<div align="right">[ <a href="#-description">↑ Back to top ↑</a> ]</div>

---

## 🔥 absolute-parent-export - rule

Encourages the use of absolute exports from parent directories.

**Options:**

- **preferPathOverBaseUrl**: `boolean`

**Usage**:

```javascript
  // .eslintrc
  module.exports = {
    rules: {
      'typescript-paths/absolute-parent-export': 'warn'
      // short for: 'typescript-paths/absolute-parent-export': ['warn', { preferPathOverBaseUrl: true } ]
    },
  };
```

#### 🔵 preferPathOverBaseUrl: `true` (default)

Encourages the use of `paths` (aliases) defined in the `tsconfig.json` file instead of exporting modules using the `baseUrl` attribute.

##### ❌ Fail

```jsonc
  // tsconfig.json
  {
    "compilerOptions": {
      "baseUrl": "./src", // default is "./*"
      "paths": [{}]
    }
  }
```

```javascript
  // relative parent exports
  export functionA from '../function-a';
  export { functionB } from '../../service/function-b';
  export * from '../../helper/util/path/function-c';

  // baseUrl exports
  export functionD from 'config/function-d';
  export { functionE } from 'service/function-e';
  export * from 'helper/util/path/function-f';
```

##### ✅ Pass

```jsonc
  // tsconfig.json
  {
    "compilerOptions": {
      "baseUrl": "./src", // default is "./"
      "paths": [{
        "@/*": "./*"
      }]
    }
  }
```

```javascript
  export functionA from '@/config/function-a';
  export { functionB } from '@/service/function-b';
  export * from '@/helper/util/path/function-c';
```

##### ✅ Pass

```jsonc
  // tsconfig.json
  {
    "compilerOptions": {
      "baseUrl": "./src", // default is "./*"
      "paths": [{
        "util/*": "./helpers/utils/*",
        "@service/*": "./service/*",
        "@/*": "./*" // the most generic path should be the last
      }]
    }
  }
```

```javascript
  export functionA from '@/config';
  export { functionB } from '@service/function-b';
  export * from 'util/path/function-c';
```

#### 🔵 preferPathOverBaseUrl: `false`

Encourages the use of `paths` (aliases) **if defined** in the `tsconfig.json` file, otherwise allows and suggests the use of absolute imports using the `baseUrl` attribute.

##### ❌ Fail

```javascript
  // relative parent exports
  export functionA from '../function-a';
  export { functionB } from '../../service/function-b';
  export * from '../../helper/util/path/function-c';
```

##### ✅ Pass

```jsonc
  // tsconfig.json
  {
    "compilerOptions": {
      "baseUrl": "./src", // default is "./*"
      "paths": [{}]
    }
  }
```

```javascript
  // baseUrl exports
  export functionA from 'config/function-a';
  export { functionB } from 'service/function-b';
  export * from 'helper/util/path/function-c';
```

##### ✅ Pass

```jsonc
  // tsconfig.json
  {
    "compilerOptions": {
      "baseUrl": "./src", // default is "./*"
      "paths": [{
        "@/*": "./*"
      }]
    }
  }
```

```javascript
  // baseUrl exports
  export functionA from 'function-a';
  export { functionB } from 'service/function-b';
  export * from 'helper/util/path/function-c';

  // paths exports
  export functionD from '@/function-d';
  export { functionE } from '@/service/function-e';
  export * from '@/helper/util/path/function-f';
```

<div align="right">[ <a href="#-description">↑ Back to top ↑</a> ]</div>

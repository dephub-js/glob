# @dephub/glob 🌟

> Enhanced glob utility with gitignore support, pattern negation, and flexible filtering. A modern alternative to traditional glob libraries with better defaults and TypeScript support.

[![NPM version](https://img.shields.io/npm/v/@dephub/glob.svg?style=flat)](https://npmjs.org/package/@dephub/glob)
[![ESM-only](https://img.shields.io/badge/ESM-only-brightgreen?style=flat)](https://nodejs.org/)

---

## Features ✨

- 🎯 **Pattern Negation** - Support for `!pattern` to exclude files
- 📁 **Gitignore Support** - Automatic respect for `.gitignore` rules
- 🔧 **Sensible Defaults** - Ignore `node_modules`, `.git` by default
- 🌐 **Cross-Platform** - Windows and POSIX path normalization
- 🔒 **Type Safe** - Full TypeScript support with precise types
- ⚡ **Fast** - Optimized traversal with parallel processing
- 🎪 **Flexible Filtering** - Dotfiles, symlinks, case sensitivity options

---

## Installation 📦

```bash
npm install @dephub/glob
# or
pnpm add @dephub/glob
# or
yarn add @dephub/glob
```

---

## Quick Start 🚀

```typescript
import { glob } from '@dephub/glob';

// Find all TypeScript files excluding tests
const files = await glob(['src/**/*.ts', '!**/*.test.ts']);

// With gitignore support and absolute paths
const projectFiles = await glob('**/*', {
  gitignore: true,
  absolute: true,
  onlyFiles: true,
});
```

---

## Usage Examples 🎯

### Basic File Discovery

```typescript
import { glob } from '@dephub/glob';

// All source files
const sourceFiles = await glob('src/**/*.{js,ts}');

// Multiple patterns with exclusion
const assets = await glob([
  '**/*.png',
  '**/*.jpg',
  '!**/node_modules/**',
  '!**/dist/**',
]);

// From specific directory
const configFiles = await glob('**/*.json', {
  projectRoot: './config',
});
```

### Advanced Filtering

```typescript
import { glob } from '@dephub/glob';

// Respect gitignore and include dotfiles
const allFiles = await glob('**/*', {
  gitignore: true,
  dot: true,
  onlyFiles: true,
});

// Case-insensitive search
const caseInsensitive = await glob('**/*.JSX', {
  ignoreCase: true,
});

// Follow symbolic links
const withSymlinks = await glob('**/*', {
  followSymlinks: true,
});
```

### Project Configuration

```typescript
import { glob } from '@dephub/glob';

// Common project setup
const projectFiles = await glob(['**/*', '!**/node_modules/**'], {
  projectRoot: process.cwd(),
  gitignore: true,
  onlyFiles: true,
  dot: false,
  ignores: ['*.log', 'temp/**'],
});
```

---

## API Reference 📚

### `glob(pattern, options)`

The main glob function that returns a promise resolving to matched file paths.

**Parameters:**

- `pattern` (string | string[]) - Glob pattern or array of patterns. Use `!pattern` for exclusion.
- `options` (Options) - Configuration options

**Returns:** `Promise<string[]>`

### Options

| Option           | Type     | Default         | Description                        |
| ---------------- | -------- | --------------- | ---------------------------------- |
| `projectRoot`    | string   | `process.cwd()` | Root directory for search          |
| `ignores`        | string[] | `[]`            | Additional patterns to ignore      |
| `ignoreCase`     | boolean  | `false`         | Case-insensitive matching          |
| `gitignore`      | boolean  | `false`         | Respect `.gitignore` files         |
| `onlyFiles`      | boolean  | `false`         | Return only files, not directories |
| `dot`            | boolean  | `false`         | Include dotfiles (e.g., `.env`)    |
| `followSymlinks` | boolean  | `false`         | Follow symbolic links              |
| `absolute`       | boolean  | `false`         | Return absolute paths              |

---

## Pattern Syntax 🎪

### Positive Patterns

```typescript
// Include all TypeScript files
await glob('src/**/*.ts');

// Multiple file extensions
await glob('src/**/*.{js,ts,jsx,tsx}');
```

### Negative Patterns (Exclusion)

```typescript
// Exclude test files and node_modules
await glob([
  'src/**/*.ts',
  '!**/*.test.ts',
  '!**/*.spec.ts',
  '!node_modules/**',
]);
```

### Advanced Patterns

```typescript
// Complex inclusion/exclusion
await glob([
  '**/*.ts',
  '!**/dist/**',
  '!**/node_modules/**',
  '!**/*.d.ts',
  '**/*.js',
  '!**/vendor/**',
]);
```

---

## Common Use Cases 🔧

### Build System Integration

```typescript
import { glob } from '@dephub/glob';

const sourceFiles = await glob(
  ['src/**/*.{js,ts}', '!**/*.test.*', '!**/*.spec.*'],
  {
    gitignore: true,
    onlyFiles: true,
  },
);
```

### Asset Collection

```typescript
const assets = await glob(
  [
    '**/*.{png,jpg,svg,gif}',
    '**/*.{woff,woff2,ttf}',
    '!node_modules/**',
    '!dist/**',
  ],
  {
    onlyFiles: true,
  },
);
```

### Configuration Discovery

```typescript
const configFiles = await glob(
  ['**/*config*.{json,js,ts}', '**/.env*', '!node_modules/**'],
  {
    dot: true,
    gitignore: true,
  },
);
```

---

## Integration Examples 🔗

### With File Operations

```typescript
import { glob } from '@dephub/glob';
import { readFile, writeFile } from '@dephub/read-write';

// Process all Markdown files
const markdownFiles = await glob('**/*.md', {
  gitignore: true,
  onlyFiles: true,
});

for (const file of markdownFiles) {
  const content = await readFile(file, 'utf-8');
  const processed = transformContent(content);
  await writeFile(file, processed);
}
```

### With Testing Frameworks

```typescript
import { glob } from '@dephub/glob';

// Find all test files
const testFiles = await glob('**/*.{test,spec}.{js,ts}', {
  ignores: ['node_modules/**', 'dist/**'],
});

// Configure test runner with found files
configureTests(testFiles);
```

### CLI Tool Integration

```typescript
#!/usr/bin/env node
import { glob } from '@dephub/glob';

const patterns = process.argv.slice(2);
const files = await glob(patterns, {
  gitignore: true,
  onlyFiles: true,
});

console.log(files.join('\n'));
```

---

## Migration from Other Glob Libraries

### From `fast-glob`

```typescript
// Before
import fastGlob from 'fast-glob';
const files = await fastGlob(['**/*.ts', '!**/*.d.ts'], {
  ignore: ['node_modules/**'],
  dot: true,
});

// After
import { glob } from '@dephub/glob';
const files = await glob(['**/*.ts', '!**/*.d.ts'], {
  ignores: ['node_modules/**'],
  dot: true,
});
```

### From `globby`

```typescript
// Before
import { globby } from 'globby';
const files = await globby('**/*.ts', {
  gitignore: true,
  dot: true,
});

// After
import { glob } from '@dephub/glob';
const files = await glob('**/*.ts', {
  gitignore: true,
  dot: true,
});
```

---

## Performance Tips ⚡

- Use `onlyFiles: true` when you don't need directories
- Set `gitignore: true` to avoid traversing ignored paths
- Use specific patterns instead of `**/*` when possible
- Combine multiple exclusions in a single `ignores` array

---

## License 📄

MIT License – see [LICENSE](LICENSE) for details.

**Author:** Estarlin R ([estarlincito.com](https://estarlincito.com))

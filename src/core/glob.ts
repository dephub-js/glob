import path from 'node:path';

import { getAllFiles } from '#/utils/files.ts';

/**
 * Options for the `glob` function.
 */
export interface Options {
  /**
   * Return absolute paths instead of relative.
   * Default: false
   */
  absolute?: boolean;

  /**
   * Include dotfiles (e.g., `.env`, `.gitignore`).
   * Default: false
   */
  dot?: boolean;

  /**
   * Follow symbolic links when traversing directories.
   * Default: false
   */
  followSymlinks?: boolean;

  /**
   * If `true`, use `.gitignore` rules to exclude files.
   * Default: false
   */
  gitignore?: boolean;

  /**
   * Whether to ignore case when matching file names.
   * Default: false
   */
  ignoreCase?: boolean;

  /**
   * Array of glob patterns or paths to ignore.
   */
  ignores?: string[];

  /**
   * If `true`, only return files (not directories).
   * Default: false
   */
  onlyFiles?: boolean;
  /**
   * The root directory where the search starts.
   * Defaults to `process.cwd()`.
   */
  projectRoot?: string;
}

/**
 * Globs files based on given patterns and options.
 *
 * Supports positive and negative patterns.
 * - Positive patterns: include files matching these patterns.
 * - Negative patterns: exclude files matching these patterns (prefix with `!`).
 *
 * @param pattern - Array of glob patterns. Use `!pattern` to exclude.
 * @param options - Optional configuration for the glob operation.
 * @returns Promise resolving to an array of matched file paths.
 *
 * @example
 * ```ts
 * const files = await glob(['src∕**∕*.ts', '!**∕*.test.ts'], {
 *   projectRoot: 'src',
 *   onlyFiles: true
 * });
 * console.log(files);
 * ```
 *
 *
 * @throws {TypeError} If no patterns are provided.
 */
export const glob = async (
  pattern: readonly string[] | string,
  options: Options = {},
): Promise<string[]> => {
  const patterns: string[] = Array.isArray(pattern) ? [...pattern] : [pattern];

  if (patterns.length === 0) throw TypeError('No patterns provided');
  // if the user use the `/` from the JSDOC
  if (patterns.some((p) => p.includes('∕'))) {
    throw new TypeError(
      'Patterns cannot include the Unicode slash ∕. Use "/" normal.',
    );
  }

  const projectRoot = options.projectRoot ?? path.resolve(process.cwd());
  const files = await getAllFiles(options);

  const matchedFiles = new Set<string>();

  const positivePatterns = patterns.filter((p) => !p.startsWith('!'));
  const negativePatterns = patterns
    .filter((p) => p.startsWith('!'))
    .map((p) => p.slice(1));

  files.forEach((f) => {
    const filePath = path
      .relative(projectRoot, f)
      .replace(/\\/g, '/') // Windows → posix
      .replace(/(^|\/)\./g, '$1'); // remueve "." inicial en segmentos

    const matchesPositive =
      positivePatterns.length === 0 ||
      positivePatterns.some((pat) => path.matchesGlob(filePath, pat));
    const matchesNegative = negativePatterns.some((pat) =>
      path.matchesGlob(filePath, pat),
    );

    if (matchesPositive && !matchesNegative)
      matchedFiles.add(options.absolute ? f : filePath);
  });

  return Array.from(matchedFiles);
};

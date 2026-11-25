import path from 'node:path';

import type { Options } from '#/core/glob.ts';

import { traverse } from './traverse.ts';

export const getAllFiles = async (options: Options = {}): Promise<string[]> => {
  const projectRoot = options.projectRoot ?? path.resolve(process.cwd());
  const dot = options.dot ?? false;
  const followSymlinks = options.followSymlinks ?? false;
  const gitignore = options.gitignore ?? false;
  const onlyFiles = options.onlyFiles ?? true;
  const ignoreCase = options.ignoreCase ?? false;

  let basenameIgnores = new Set([
    ...(options.ignores ?? []),
    '.DS_Store',
    '.git',
    'node_modules',
  ]);

  if (ignoreCase) {
    basenameIgnores = new Set(
      Array.from(basenameIgnores).map((ignore) => ignore.toLowerCase()),
    );
  }

  return traverse(
    projectRoot,
    projectRoot,
    dot,
    followSymlinks,
    gitignore,
    onlyFiles,
    ignoreCase,
    basenameIgnores,
    [],
  );
};

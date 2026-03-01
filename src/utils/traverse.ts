/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'node:fs/promises';
import path from 'node:path';

export const traverse = async (
  dir: string,
  projectRoot: string,
  dot: boolean,
  followSymlinks: boolean,
  gitignore: boolean,
  onlyFiles: boolean,
  ignoreCase: boolean,
  basenameIgnores: Set<string>,
  ignorePatterns: string[],
): Promise<string[]> => {
  const localIgnorePatterns = [...ignorePatterns];

  if (gitignore) {
    const gitignorePath = path.join(dir, '.gitignore');
    try {
      const content = await fs.readFile(gitignorePath, 'utf8');
      const patterns = content
        .split('\n')
        .map((line) => line.trim())
        .filter(
          (line) => line && !line.startsWith('#') && !line.startsWith('!'),
        );

      const relDir = path.relative(projectRoot, dir).replace(/\\/g, '/');
      patterns.forEach((p) => {
        const pat = p.startsWith('/') ? p.slice(1) : p;
        const globalPat = path.posix.join(relDir, pat);
        localIgnorePatterns.push(globalPat);
      });
    } catch {
      //
    }
  }

  const entries = await fs.readdir(dir, { withFileTypes: true });

  const subPromises = entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(projectRoot, fullPath).replace(/\\/g, '/');

    let entryName = entry.name;
    if (ignoreCase) entryName = entryName.toLowerCase();

    if (basenameIgnores.has(entryName)) return [];
    if (!dot && entry.name.startsWith('.')) return [];

    let isIgnored = false;
    if (gitignore && localIgnorePatterns.length > 0) {
      isIgnored = localIgnorePatterns.some((pat) => {
        let checkRel = relPath;
        let checkPat = pat;
        if (ignoreCase) {
          checkRel = checkRel.toLowerCase();
          checkPat = checkPat.toLowerCase();
        }
        return path.matchesGlob(checkRel, checkPat);
      });
    }
    if (isIgnored) return [];

    if (entry.isSymbolicLink()) {
      if (!followSymlinks) return [];
      try {
        const targetStat = await fs.stat(fullPath);
        if (targetStat.isDirectory()) {
          const subFiles = await traverse(
            fullPath,
            projectRoot,
            dot,
            followSymlinks,
            gitignore,
            onlyFiles,
            ignoreCase,
            basenameIgnores,
            localIgnorePatterns,
          );
          const result = [...subFiles];
          if (!onlyFiles) result.push(fullPath);
          return result;
        }
        return [fullPath];
      } catch {
        return [];
      }
    } else if (entry.isDirectory()) {
      const subFiles = await traverse(
        fullPath,
        projectRoot,
        dot,
        followSymlinks,
        gitignore,
        onlyFiles,
        ignoreCase,
        basenameIgnores,
        localIgnorePatterns,
      );
      const result = [...subFiles];
      if (!onlyFiles) result.push(fullPath);
      return result;
    } else if (entry.isFile()) {
      return [fullPath];
    }

    return [];
  });

  const subResults = await Promise.all(subPromises);

  return subResults.flat();
};

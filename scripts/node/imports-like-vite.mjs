import {registerHooks} from 'node:module';
import {existsSync, statSync} from 'node:fs';
import {extname, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const isDirectory = (path) => existsSync(path) && statSync(path).isDirectory();

const fileFor = (path) => {
  if (isDirectory(path)) return join(path, 'index.ts');
  if (extname(path) === '' && existsSync(`${path}.ts`)) return `${path}.ts`;
  return path;
};

registerHooks({
  resolve(specifier, context, next) {
    if (!specifier.startsWith('.') || context.parentURL === undefined) return next(specifier, context);
    const path = fileURLToPath(new URL(specifier, context.parentURL));
    return next(pathToFileURL(fileFor(path)).href, context);
  }
});

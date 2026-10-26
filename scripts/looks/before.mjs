import {execFileSync} from 'node:child_process';
import {empty} from '@ryandur/sand';
import {copyFileSync, existsSync, mkdirSync, symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';

const repo = resolve(import.meta.dirname, '../..');
const ref = process.argv[2] ?? 'main';
const commit = execFileSync('git', ['-C', repo, 'rev-parse', '--short=12', ref], {encoding: 'utf8'}).trim();
const root = join(tmpdir(), 'chosen-picachu-looks', commit);
const frameworkModeOutput = 'build/client';
const libraryModeOutput = 'dist';
const builtAt = () => [frameworkModeOutput, libraryModeOutput].map(output => join(root, output)).find(output => existsSync(join(output, 'index.html')));

if (empty(builtAt())) {
  mkdirSync(root, {recursive: true});
  execFileSync('sh', ['-c', `git -C '${repo}' archive ${commit} | tar -x -C '${root}'`], {stdio: 'inherit'});
  if (!existsSync(join(root, 'node_modules'))) symlinkSync(join(repo, 'node_modules'), join(root, 'node_modules'));
  if (existsSync(join(repo, '.env'))) copyFileSync(join(repo, '.env'), join(root, '.env'));
  execFileSync('npm', ['run', 'build'], {cwd: root, stdio: ['ignore', 'ignore', 'inherit']});
}

process.stdout.write(`${builtAt()}\n`);

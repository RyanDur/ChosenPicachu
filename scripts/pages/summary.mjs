import {empty, has, not} from '@ryandur/sand';
import {readFileSync, readdirSync} from 'node:fs';
import {join, relative} from 'node:path';
import {JSDOM} from 'jsdom';

// What changes on every build and says nothing about the page: the assets' content hashes, the commit the source
// links point at, React's ids and the empty comments it writes between neighboring texts.
const steady = html => html
  .replace(/(assets\/[\w.-]+?)-[\w-]{8}\.(js|css)/g, '$1.$2')
  .replace(/(github\.com\/RyanDur\/ChosenPicachu\/blob\/)[0-9a-f]{40}/g, '$1<sha>')
  .replace(/_R_[a-z0-9]+_/g, '_R_')
  .replace(/<!-- -->/g, '');

// A block's text ends where the block does, as a reader sees it; inline elements keep their spacing exactly, so a
// space lost beside a code element still shows as a change.
const blocks = 'address, article, aside, blockquote, br, caption, dd, details, div, dl, dt, figcaption, figure, footer, ' +
  'form, h1, h2, h3, h4, h5, h6, header, hgroup, hr, legend, li, main, nav, ol, p, pre, section, summary, table, td, ' +
  'th, tr, ul';

const wordsOf = html => {
  const {document} = new JSDOM(html).window;
  document.querySelectorAll(blocks).forEach(block => block.append('\n'));
  return (document.querySelector('main') ?? document.body).textContent.split(/\s+/).filter(word => word !== '');
};

const around = 6;

const shared = (left, right) => {
  let count = 0;
  while (count < left.length && count < right.length && left[count] === right[count]) count++;
  return count;
};

const excerpt = (words, start, end) =>
  `${start > 0 ? '…' : ''}${words.slice(start, end).join(' ')}${end < words.length ? '…' : ''}`;

const wordChange = (before, after) => {
  const lead = shared(before, after);
  const tail = shared(before.slice(lead).reverse(), after.slice(lead).reverse());
  const start = Math.max(0, lead - around);
  return {
    before: excerpt(before, start, Math.min(before.length, before.length - tail + around)),
    after: excerpt(after, start, Math.min(after.length, after.length - tail + around))
  };
};

const changeOf = (page, before, after) => {
  if (not(has(before))) return {page, kind: 'new'};
  if (not(has(after))) return {page, kind: 'gone'};
  const [was, is] = [steady(before), steady(after)];
  if (was === is) return undefined;
  const [wordsWere, wordsAre] = [wordsOf(was), wordsOf(is)];
  if (wordsWere.join(' ') === wordsAre.join(' ')) return {page, kind: 'markup'};
  return {page, kind: 'words', ...wordChange(wordsWere, wordsAre)};
};

export const changesBetween = (before, after) => [...new Set([...Object.keys(before), ...Object.keys(after)])]
  .sort()
  .map(page => changeOf(page, before[page], after[page]))
  .filter(change => has(change));

const named = page => page === 'index.html' ? 'home' : page.replace(/\/index\.html$/, '');

const section = (title, lines) => empty(lines) ? [] : ['', `### ${title}`, '', ...lines];

export const summaryOf = (changes, total) => {
  if (empty(changes)) return `## pages: all ${total} the same\n`;
  const of = kind => changes.filter(change => change.kind === kind);
  return [
    `## pages: ${changes.length} of ${total} changed`,
    ...section('words changed', of('words').map(({page, before, after}) => `- **${named(page)}**: “${before}” → “${after}”`)),
    ...section('markup changed, words the same', of('markup').map(({page}) => `- ${named(page)}`)),
    ...section('new pages', of('new').map(({page}) => `- ${named(page)}`)),
    ...section('pages gone', of('gone').map(({page}) => `- ${named(page)}`)),
    '',
    `${total - changes.length} the same`,
    ''
  ].join('\n');
};

const pagesIn = folder => Object.fromEntries(readdirSync(folder, {recursive: true, encoding: 'utf8'})
  .filter(file => file.endsWith('.html'))
  .map(file => [relative(folder, join(folder, file)), readFileSync(join(folder, file), 'utf8')]));

if (import.meta.main) {
  const [, , beforeFolder, afterFolder] = process.argv;
  const [before, after] = [pagesIn(beforeFolder), pagesIn(afterFolder)];
  const total = new Set([...Object.keys(before), ...Object.keys(after)]).size;
  process.stdout.write(summaryOf(changesBetween(before, after), total));
}

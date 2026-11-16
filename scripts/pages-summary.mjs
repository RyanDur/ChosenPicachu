import {empty, has, maybe} from '@ryandur/sand';
import {readdirSync, readFileSync} from 'node:fs';
import {join, relative} from 'node:path';
import {JSDOM} from 'jsdom';

const steady = html => html
  .replace(/(assets\/[\w.-]+?)-[\w-]{8}\.(js|css)/g, '$1.$2')
  .replace(/(github\.com\/RyanDur\/ChosenPicachu\/blob\/)[0-9a-f]{40}/g, '$1<sha>')
  .replace(/_R_[a-z0-9]+(?:H[a-z0-9]+)?_/g, '_R_')
  .replace(/<!-- -->/g, '');

const blockBoundaries = 'address, article, aside, blockquote, br, button, caption, dd, details, dialog, div, dl, dt, ' +
  'fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, hr, legend, li, main, menu, nav, ' +
  'ol, optgroup, option, p, pre, search, section, select, summary, table, td, textarea, th, tr, ul';

const wordsInAttributes = ['alt', 'aria-label', 'aria-description', 'placeholder', 'title'];

const wordsOf = html => {
  const {document} = new JSDOM(html).window;
  document.querySelectorAll('script, template').forEach(hidden => hidden.remove());
  document.querySelectorAll(blockBoundaries).forEach(block => {
    block.before('\n');
    block.append('\n');
  });
  /** @type {Element[]} */
  const elements = [...document.querySelectorAll('*')];
  const attributeWords = elements.flatMap(element => wordsInAttributes
    .map(attribute => maybe(element.getAttribute(attribute)).orElse(''))
    .concat(element.matches('input, textarea') ? [maybe(element.getAttribute('value')).orElse('')] : []));
  const description = maybe(document.querySelector('meta[name="description"]'))
    .map(meta => maybe(meta.getAttribute('content')).orElse(''))
    .orElse('');
  return [document.title, description, document.body.textContent, ...attributeWords].join('\n').split(/\s+/).filter(word => has(word));
};

const wordsOfContext = 6;

const matchingLeadCount = (left, right) => {
  let count = 0;
  while (count < left.length && count < right.length && left[count] === right[count]) count++;
  return count;
};

const longestExcerpt = 40;

const excerpt = (words, start, end) => {
  const shown = Math.min(end, start + longestExcerpt);
  return `${start > 0 ? '…' : ''}${words.slice(start, shown).join(' ')}${shown < words.length ? '…' : ''}`;
};

const wordChange = (before, after) => {
  const lead = matchingLeadCount(before, after);
  const tail = matchingLeadCount(before.slice(lead).reverse(), after.slice(lead).reverse());
  const start = Math.max(0, lead - wordsOfContext);
  return {
    before: excerpt(before, start, Math.min(before.length, before.length - tail + wordsOfContext)),
    after: excerpt(after, start, Math.min(after.length, after.length - tail + wordsOfContext))
  };
};

const changeOf = (page, before, after) => {
  if (empty(before)) return {page, kind: 'new'};
  if (empty(after)) return {page, kind: 'gone'};
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

const literally = words => words
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/[\\`*_[\]]/g, mark => `\\${mark}`);

const named = page => page === 'index.html' ? 'home' : page.replace(/\/index\.html$/, '');

const headedList = (heading, lines) => empty(lines) ? [] : ['', `### ${heading}`, '', ...lines];

export const summaryOf = (changes, total) => {
  if (empty(changes)) return `## pages: all ${total} the same\n`;
  const changesOfKind = kind => changes.filter(change => change.kind === kind);
  return [
    `## pages: ${changes.length} of ${total} changed`,
    ...headedList('words changed', changesOfKind('words').map(({page, before, after}) => `- **${named(page)}**: “${literally(before)}” → “${literally(after)}”`)),
    ...headedList('markup changed, words the same', changesOfKind('markup').map(({page}) => `- ${named(page)}`)),
    ...headedList('new pages', changesOfKind('new').map(({page}) => `- ${named(page)}`)),
    ...headedList('pages gone', changesOfKind('gone').map(({page}) => `- ${named(page)}`)),
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

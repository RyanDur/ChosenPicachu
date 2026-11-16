import {empty, has, maybe} from '@ryandur/sand';
import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {JSDOM} from 'jsdom';

const withoutBuildNoise = html => html
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
  document.querySelectorAll('script, template').forEach(unseen => unseen.remove());
  document.querySelectorAll(blockBoundaries).forEach(block => {
    block.before('\n');
    block.append('\n');
  });
  /** @type {Element[]} */
  const elements = [...document.querySelectorAll('*')];
  const attributeWords = elements.flatMap(element => wordsInAttributes
    .map(attribute => maybe(element.getAttribute(attribute)).orElse(''))
    .concat(element.matches('input') ? [maybe(element.getAttribute('value')).orElse('')] : []));
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

const wordChange = (onMain, onPull) => {
  const lead = matchingLeadCount(onMain, onPull);
  const tail = matchingLeadCount(onMain.slice(lead).reverse(), onPull.slice(lead).reverse());
  const start = Math.max(0, lead - wordsOfContext);
  return {
    onMain: excerpt(onMain, start, Math.min(onMain.length, onMain.length - tail + wordsOfContext)),
    onPull: excerpt(onPull, start, Math.min(onPull.length, onPull.length - tail + wordsOfContext))
  };
};

const changeOf = (page, onMain, onPull) => {
  if (empty(onMain)) return {page, kind: 'new'};
  if (empty(onPull)) return {page, kind: 'gone'};
  const [htmlOnMain, htmlOnPull] = [withoutBuildNoise(onMain), withoutBuildNoise(onPull)];
  if (htmlOnMain === htmlOnPull) return undefined;
  const [wordsWere, wordsAre] = [wordsOf(htmlOnMain), wordsOf(htmlOnPull)];
  if (wordsWere.join(' ') === wordsAre.join(' ')) return {page, kind: 'markup'};
  return {page, kind: 'words', ...wordChange(wordsWere, wordsAre)};
};

export const changesBetween = (onMain, onPull) => [...new Set([...Object.keys(onMain), ...Object.keys(onPull)])]
  .sort()
  .map(page => changeOf(page, onMain[page], onPull[page]))
  .filter(change => has(change));

const escapedForMarkdown = words => words
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/[\\`*_[\]]/g, mark => `\\${mark}`);

const shownName = page => page === 'index.html' ? 'home' : page.replace(/\/index\.html$/, '');

const headedList = (heading, lines) => empty(lines) ? [] : ['', `### ${heading}`, '', ...lines];

export const summaryOf = (changes, total) => {
  if (empty(changes)) return `## pages: all ${total} the same\n`;
  const changesOfKind = kind => changes.filter(change => change.kind === kind);
  return [
    `## pages: ${changes.length} of ${total} changed`,
    ...headedList('words changed', changesOfKind('words').map(({page, onMain, onPull}) => `- **${shownName(page)}**: “${escapedForMarkdown(onMain)}” → “${escapedForMarkdown(onPull)}”`)),
    ...headedList('markup changed, words the same', changesOfKind('markup').map(({page}) => `- ${shownName(page)}`)),
    ...headedList('new pages', changesOfKind('new').map(({page}) => `- ${shownName(page)}`)),
    ...headedList('pages gone', changesOfKind('gone').map(({page}) => `- ${shownName(page)}`)),
    '',
    `${total - changes.length} the same`,
    ''
  ].join('\n');
};

const pagesIn = folder => Object.fromEntries(readdirSync(folder, {recursive: true, encoding: 'utf8'})
  .filter(file => file.endsWith('.html'))
  .map(file => [file, readFileSync(join(folder, file), 'utf8')]));

if (import.meta.main) {
  const [, , beforeFolder, afterFolder] = process.argv;
  const [onMain, onPull] = [pagesIn(beforeFolder), pagesIn(afterFolder)];
  const total = new Set([...Object.keys(onMain), ...Object.keys(onPull)]).size;
  process.stdout.write(summaryOf(changesBetween(onMain, onPull), total));
}

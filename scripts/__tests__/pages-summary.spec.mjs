import {changesBetween, summaryOf} from '../pages-summary.mjs';

const page = (main, head = '') =>
  `<html lang="en"><head>${head}</head><body><header>ChosenPicachu</header><main>${main}</main></body></html>`;

const one = (path, before, after) => changesBetween({[path]: before}, {[path]: after});

describe('the pages summary', () => {
  test('a page whose words change is listed with the words before and after', () => {
    const [change] = one('demos/tables/index.html',
      page('<p>A row moves when you drag it.</p>'),
      page('<p>A row moves when you drag its handle.</p>'));

    expect(change.kind).toBe('words');
    expect(change.before).toContain('drag it.');
    expect(change.after).toContain('drag its handle.');
  });

  test('a wrapper around words that come before a block changes only markup', () => {
    const [change] = one('index.html', page('<span>Open</span><p>menu</p>'), page('<p><span>Open</span></p><p>menu</p>'));

    expect(change.kind).toBe('markup');
  });

  test('a wrapper around words that come before a dialog changes only markup', () => {
    const [change] = one('index.html', page('<span>Open</span><dialog>Close</dialog>'),
      page('<p><span>Open</span></p><dialog>Close</dialog>'));

    expect(change.kind).toBe('markup');
  });

  test('a wrapper around words that come before a fieldset changes only markup', () => {
    const [change] = one('index.html', page('<span>Name</span><fieldset>Given</fieldset>'),
      page('<p><span>Name</span></p><fieldset>Given</fieldset>'));

    expect(change.kind).toBe('markup');
  });

  test('buttons that lose their list items change only markup', () => {
    const [change] = one('index.html', page('<ul><li><button>Open</button></li><li><button>Close</button></li></ul>'),
      page('<menu><button>Open</button><button>Close</button></menu>'));

    expect(change.kind).toBe('markup');
  });

  test('a space lost between two words is a change of words', () => {
    const [change] = one('index.html', page('<p>the <code>details</code> element</p>'), page('<p>the <code>details</code>element</p>'));

    expect(change.kind).toBe('words');
  });

  test('a page whose markup changes but whose words do not is markup only', () => {
    const [change] = one('index.html', page('<p class="paragraph">Same words.</p>'), page('<p class="paragraph muted-ink">Same words.</p>'));

    expect(change.kind).toBe('markup');
  });

  test('what differs from one build to the next is not a change', () => {
    const built = (hash, sha, id) => page(
      `<a href="https://github.com/RyanDur/ChosenPicachu/blob/${sha}/src/a.ts#L1">a.ts</a>` +
      `<h2 id="tutorials${id}">Tables<!-- --> tab</h2>`,
      `<script type="module" src="/ChosenPicachu/assets/entry.client-${hash}.js"></script>`);

    expect(one('index.html',
      built('JI7zjAv7', '4379d3d675813c64b592ca0b6aa91906929ce060', '_R_174m_'),
      built('Bj2un6Nt', 'daf3d71155e32dbc71a6da32f0a3f0fe7e57770b', '_R_af6v74m_'))).toEqual([]);
  });

  test('a second id React gives in one component is not a change either', () => {
    expect(one('index.html', page('<p id="_R_174mH1_">a</p>'), page('<p id="_R_af6vH1_">a</p>'))).toEqual([]);
  });

  test('words outside main, in the header, count as words', () => {
    const [change] = one('index.html',
      '<html lang="en"><body><header>Demos</header><main><p>a</p></main></body></html>',
      '<html lang="en"><body><header>Exhibits</header><main><p>a</p></main></body></html>');

    expect(change.kind).toBe('words');
  });

  test('a page whose title changes has changed its words', () => {
    const [change] = one('index.html', page('<p>a</p>', '<title>Demos</title>'), page('<p>a</p>', '<title>Exhibits</title>'));

    expect(change.kind).toBe('words');
  });

  test('a page whose description changes has changed its words', () => {
    const described = words => page('<p>a</p>', `<meta name="description" content="${words}">`);

    expect(one('index.html', described('the demos'), described('the exhibits'))[0].kind).toBe('words');
  });

  test('a picture whose alt text changes has changed its words', () => {
    expect(one('index.html', page('<img src="a.png" alt="a cat">'), page('<img src="a.png" alt="a dog">'))[0].kind).toBe('words');
  });

  test('a control whose label changes has changed its words', () => {
    const labeled = words => page(`<button aria-label="${words}"></button>`);

    expect(one('index.html', labeled('open'), labeled('close'))[0].kind).toBe('words');
  });

  test('a control whose label changes has changed its words, even beside an empty alt', () => {
    const labeled = words => page(`<img src="a.png" alt="" aria-label="${words}">`);

    expect(one('index.html', labeled('a cat'), labeled('a dog'))[0].kind).toBe('words');
  });

  test('a field whose placeholder changes has changed its words', () => {
    const field = words => page(`<input placeholder="${words}">`);

    expect(one('index.html', field('search'), field('find'))[0].kind).toBe('words');
  });

  test('a field whose value changes has changed its words', () => {
    const field = words => page(`<input value="${words}">`);

    expect(one('index.html', field('one'), field('two'))[0].kind).toBe('words');
  });

  test('a change spread across the page is shown in an excerpt of bounded length', () => {
    const many = Array.from({length: 300}, (_, at) => `w${at}`).join(' ');
    const [change] = one('index.html', page(`<header>old</header><p>${many}</p><footer>old</footer>`),
      page(`<header>new</header><p>${many}</p><footer>new</footer>`));

    expect(change.before.split(' ').length).toBeLessThanOrEqual(41);
  });

  test('a tag or a mark in the words is shown as written, not rendered', () => {
    const summary = summaryOf([{page: 'index.html', kind: 'words', before: 'the <details> *x*', after: 'a & b'}], 1);

    expect(summary).toContain('“the &lt;details&gt; \\*x\\*” → “a &amp; b”');
  });

  test('a page only one build has is listed as new or gone', () => {
    const changes = changesBetween({'old/index.html': page('<p>old</p>')}, {'new/index.html': page('<p>new</p>')});

    expect(changes).toEqual([{page: 'new/index.html', kind: 'new'}, {page: 'old/index.html', kind: 'gone'}]);
  });

  test('a summary names each changed page under what changed, and counts the rest as the same', () => {
    const summary = summaryOf([
      {page: 'demos/tables/index.html', kind: 'words', before: '…drag it.', after: '…drag its handle.'},
      {page: 'users/index.html', kind: 'markup'}
    ], 24);

    expect(summary).toContain('## pages: 2 of 24 changed');
    expect(summary).toContain('### words changed');
    expect(summary).toContain('- **demos/tables**: “…drag it.” → “…drag its handle.”');
    expect(summary).toContain('### markup changed, words the same');
    expect(summary).toContain('- users');
    expect(summary).toContain('22 the same');
  });

  test('no change reads as every page the same', () => {
    expect(summaryOf([], 24)).toContain('## pages: all 24 the same');
  });
});

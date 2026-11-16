import {changesBetween, summaryOf} from '../pages/summary.mjs';

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

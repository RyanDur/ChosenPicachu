import {execFileSync} from 'node:child_process';
import {audited, slug, stage} from '../lighthouse/audited.mjs';
import {pages} from '../../e2e/pages';

describe('the pages under a performance budget', () => {
  test('are the site pages that say so, named for their artifacts and addressed on the stub stage', () => {
    const matrix = audited();
    const budgeted = pages.filter(page => page.budgeted === true);

    expect(matrix).toHaveLength(budgeted.length);
    expect(matrix.length).toBeGreaterThan(0);
    matrix.forEach(({page, url}, at) => {
      expect(page).toBe(slug(budgeted[at].name));
      expect(page).not.toMatch(/\s/);
      expect(url).toBe(`${stage}${budgeted[at].path}`);
    });
  });

  test('node with the vite-like import hook runs the script and prints the same matrix', () => {
    const printed = execFileSync(process.execPath, ['--import', './scripts/node/imports-like-vite.mjs', 'scripts/lighthouse/audited.mjs'], {encoding: 'utf8'});
    expect(JSON.parse(printed)).toEqual(audited());
  });

  test('a page name becomes one word', () => {
    expect(slug('tables in vanilla')).toBe('tables-in-vanilla');
  });

  test('the gallery is audited on the museum the stage has recorded', () => {
    expect(audited().find(({page}) => page === 'gallery')?.url).toContain('tab=vam');
  });
});

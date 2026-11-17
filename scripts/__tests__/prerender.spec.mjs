import {Paths} from '@navigation';
import {DemoTopics} from '@pages/Demos/demo-topics';
import {demoTab} from '@pages/Demos/demo-tab';
import {chartKinds} from '@pages/Demos/Charts/chart-kinds';
import {practiceAddress} from '@pages/Practice';
import {concerns} from '@pages/Record/concerns';
import {not} from '@ryandur/sand';
import {prerender} from '../../src/entry.server';

describe('the pages drawn into the build', () => {
  // eslint-disable-next-line tests/parameterized-for-drift -- drift: every page in the site's page list
  test.each([
    ...Object.values(Paths).filter(/** @param {string} path */ path => path.startsWith('/') && not(path.includes(':'))),
    ...Object.values(DemoTopics).map(demoTab.address),
    `${Paths.demos}accordions/a-box-remembers-the-fold/`,
    `${Paths.demos}accordions/the-max-height-guess/`,
    `${Paths.demos}accordions/the-measured-height/`,
    `${Paths.demos}accordions/what-the-platform-gives-now/`,
    `${Paths.demos}z-index/why-third-is-on-top/`,
    `${Paths.demos}z-index/why-9999-still-loses/`,
    `${Paths.demos}z-index/what-else-forms-a-stacking-context/`,
    `${Paths.demos}z-index/why-the-popover-wins/`,
    `${Paths.demos}z-index/why-a-fixed-banner-still-loses/`,
    `${Paths.demos}z-index/lets-build-this-feature/`,
    `${Paths.demos}tables/the-need-and-its-clues/`,
    `${Paths.demos}tables/the-sketch/`,
    `${Paths.demos}tables/the-slices/`,
    `${Paths.demos}tables/the-still-table/`,
    `${Paths.demos}tables/the-live-table-and-the-store/`,
    ...chartKinds.all.map(kind => `${Paths.demos}charts/${kind}/`),
    ...concerns.inOrder.map(practiceAddress.of)
  ])('include %s', address => {
    expect(prerender.pages).toContain(address);
  });
});

describe('a page that sends the reader on to a saved tab', () => {
  test('should be drawn into the build without a warning', async () => {
    const warned = vi.spyOn(console, 'warn');

    await prerender.page(Paths.demos);

    expect(warned).not.toHaveBeenCalled();
    warned.mockRestore();
  });
});

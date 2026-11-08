import {Paths} from '@navigation';
import {DemoTopics} from '@pages/Demos/demo-topics';
import {demoTab} from '@pages/Demos/demo-tab';
import {chartKinds} from '@pages/Demos/Charts/chart-kinds';
import {practiceAddress} from '@pages/Practice';
import {concerns} from '@pages/Record/concerns';
import {not} from '@ryandur/sand';
import {prerender} from '../../src/entry.server';

describe('the pages drawn into the build', () => {
  test.each([
    ...Object.values(Paths).filter(/** @param {string} path */ path => path.startsWith('/') && not(path.includes(':'))),
    ...Object.values(DemoTopics).map(demoTab.address),
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

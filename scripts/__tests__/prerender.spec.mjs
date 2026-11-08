import {Paths} from '@frame/navigation';
import {demoAddress, DemoTopics} from '@pages/Demos/types';
import {allChartKinds} from '@pages/Demos/Charts/kinds';
import {practiceAddress} from '@pages/Practice/types';
import {concernsInOrder} from '@pages/Record/moments/concerns';
import {prerender} from '../../src/entry.server';

describe('the pages drawn into the build', () => {
  test.each([
    ...Object.values(Paths).filter(/** @param {string} path */ path => path.startsWith('/') && !path.includes(':')),
    ...Object.values(DemoTopics).map(demoAddress),
    ...allChartKinds.map(kind => `${Paths.demos}charts/${kind}/`),
    ...concernsInOrder.map(practiceAddress)
  ])('include %s', address => {
    expect(prerender.pages).toContain(address);
  });
});

describe('a page that sends the reader on to a saved tab', () => {
  test('is drawn into the build without a warning', async () => {
    const warned = vi.spyOn(console, 'warn');

    await prerender.page(Paths.demos);

    expect(warned).not.toHaveBeenCalled();
    warned.mockRestore();
  });
});

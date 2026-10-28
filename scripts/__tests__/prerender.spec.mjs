import config from '../../react-router.config';
import {Paths} from '@pages/Paths';
import {GamePaths} from '@pages/Games/GamePaths';
import {demoAddress, DemoTopics} from '@pages/Demos/types';
import {allChartKinds} from '@pages/Demos/Charts/kinds';
import {practiceAddress} from '@pages/Practice/types';
import {concernsInOrder} from '@pages/Record/moments/concerns';

describe('the pages drawn into the build', () => {
  test.each([
    ...Object.values(Paths).filter(/** @param {string} path */ path => path.startsWith('/') && !path.includes(':')),
    `${Paths.games}${GamePaths.colorGame}`,
    ...Object.values(DemoTopics).map(demoAddress),
    ...allChartKinds.map(kind => `${Paths.demos}charts/${kind}/`),
    ...concernsInOrder.map(practiceAddress)
  ])('include %s', address => {
    expect(config.prerender).toContain(address);
  });
});

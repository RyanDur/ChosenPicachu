import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@navigation';
import {demoPage} from '@pages/Demos/__test_support';
import {TablesIntroduction} from '../Introduction';

describe('the tables tab’s introduction', () => {
  test('should say what it assumes from earlier tabs, linking each tab it names', () => {
    render(<TestApp at="/"><TablesIntroduction/></TestApp>);

    expect(demoPage.assumedLinks()).toEqual([
      ['charts tab', `${Paths.demos}charts/`],
      ['drag sort tab', `${Paths.demos}drag-and-drop/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['accordions tab', `${Paths.demos}accordions/`]
    ]);
  });

  test('should link each term it glosses, and each tab it names, to that tab', () => {
    render(<TestApp at="/"><TablesIntroduction/></TestApp>);

    expect(demoPage.linksToTabs()).toEqual([
      ['charts tab', `${Paths.demos}charts/`],
      ['drag sort tab', `${Paths.demos}drag-and-drop/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['accordions tab', `${Paths.demos}accordions/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['events', `${Paths.demos}z-index/`],
      ['z-index tab', `${Paths.demos}z-index/`]
    ]);
  });
});

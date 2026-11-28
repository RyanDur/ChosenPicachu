import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {menuInTheTopLayer} from '@pages/Demos/ZIndexDemo/__test_support';

const popoverWins = 'z-index/why-the-popover-wins';

describe('the menu in the top layer, in why the popover wins', () => {
  test('should mark card one’s rule beside the list’s margin once the reader gives it z-index 9999', async () => {
    render(<TestApp at={demosAt(popoverWins)}/>);

    await menuInTheTopLayer.togglesCardOne();

    expect(await menuInTheTopLayer.markedRules()).toEqual([
      '.one {', 'position: relative;', 'z-index: 9999;', '}',
      '.sort-list {', 'margin: auto;', '}'
    ]);
  });

  test('should mark only the list’s margin once the reader takes card one’s z-index away', async () => {
    render(<TestApp at={demosAt(popoverWins, '?card-one-z=9999')}/>);

    await menuInTheTopLayer.togglesCardOne();

    expect(await menuInTheTopLayer.markedRules()).toEqual(['.sort-list {', 'margin: auto;', '}']);
  });

  test('should open with card one given z-index 9999 when a copied address says so', async () => {
    render(<TestApp at={demosAt(popoverWins, '?card-one-z=9999')}/>);

    expect(await menuInTheTopLayer.raiseCardOne()).toBeChecked();
  });

  test('should say card one now rises over card two, with the list above both, once the reader gives it z-index 9999', async () => {
    render(<TestApp at={demosAt(popoverWins)}/>);

    await menuInTheTopLayer.togglesCardOne();

    expect(await menuInTheTopLayer.whatTheListDid()).toHaveTextContent('Card one now rises over card two’s edge, and the list stays above both.');
  });

  test('should say card one’s 9999 has nothing to be compared with, since card two has no z-index, once the reader gives it z-index 9999', async () => {
    render(<TestApp at={demosAt(popoverWins)}/>);

    await menuInTheTopLayer.togglesCardOne();

    expect(await menuInTheTopLayer.comparedWith()).toHaveTextContent('Compared with: nothing. Card two has no z-index, so card one’s 9999 has nothing to be compared with.');
  });
});

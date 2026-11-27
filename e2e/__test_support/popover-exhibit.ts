import type {Page} from '@playwright/test';

export const popoverExhibit = (page: Page) => {
  const exhibit = page.getByRole('figure', {name: 'The menu in the top layer', exact: true});
  const sortBy = exhibit.getByRole('button', {name: 'Sort by', exact: true});
  const list = exhibit.getByRole('list', {name: 'Sort by', exact: true});
  return {
    sortBy,
    list,
    newest: list.getByRole('button', {name: 'Newest', exact: true}),
    caption: exhibit.getByText(/^The menu in the top layer\. The list is a popover\./),
    nineThousand: exhibit.getByRole('checkbox', {name: /Give card one z-index: 9999\.$/}),
    nineThousandWords: exhibit.getByText(/^Curious whether a z-index changes any of this\?/),
    cardOneUnderTheMiddle: (): Promise<void> => exhibit.getByText('Card one', {exact: true}).evaluate(card => {
      const {top, height} = card.getBoundingClientRect();
      window.scrollBy(0, top + height / 2 - document.documentElement.clientHeight / 2);
    }),
    centeredInTheWindow: (): Promise<boolean> => list.evaluate(shown => {
      const {left, right, top, bottom} = shown.getBoundingClientRect();
      const {clientWidth, clientHeight} = document.documentElement;
      const offCenter = (low: number, high: number, length: number): number => Math.abs((low + high) / 2 - length / 2);
      return offCenter(left, right, clientWidth) <= 1 && offCenter(top, bottom, clientHeight) <= 1;
    })
  };
};

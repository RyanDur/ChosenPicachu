import type {Page} from '@playwright/test';

export type SortChoice = 'name' | 'date' | 'size';

export const trappedMenu = (page: Page) => {
  const trap = page.getByRole('figure', {name: /^The trap\./});
  const sortBy = trap.getByRole('button', {name: /^Sort by/});
  const choice = (name: SortChoice) => trap.getByRole('menuitem', {name});
  return {
    sortBy,
    choice,
    contextChoice: trap.getByRole('checkbox', {name: 'Card one has z-index: 1'}),
    contextWords: trap.getByText('Card one has z-index: 1'),
    caption: trap.getByText(/Open Sort by, then change the checkbox/),
    open: (): Promise<void> => sortBy.click(),
    openByKeyboard: async (): Promise<void> => {
      await sortBy.focus();
      await page.keyboard.press('Enter');
    },
    onTopAt: async (name: SortChoice): Promise<string> => choice(name).evaluate((element, cardTwo) => {
      const {left, top, width, height} = element.getBoundingClientRect();
      const topmost = document.elementFromPoint(left + width / 2, top + height / 2);
      if (element.contains(topmost)) {
        return 'the choice';
      }
      return cardTwo?.contains(topmost) ?? false ? 'card two' : 'something else';
    }, await trap.getByRole('listitem').filter({hasText: /^Card two\./}).elementHandle())
  };
};

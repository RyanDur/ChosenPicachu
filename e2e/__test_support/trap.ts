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
    says: trap.getByRole('status', {name: 'what card one does'}),
    open: (): Promise<void> => sortBy.click(),
    openByKeyboard: async (): Promise<void> => {
      await sortBy.focus();
      await page.keyboard.press('Enter');
    },
    onTopAt: (name: SortChoice): Promise<string> => choice(name).evaluate(element => {
      const {left, top, width, height} = element.getBoundingClientRect();
      const topmost = document.elementFromPoint(left + width / 2, top + height / 2);
      return element.contains(topmost) ? 'the choice' : topmost?.closest('li')?.textContent?.trim() ?? 'nothing';
    })
  };
};

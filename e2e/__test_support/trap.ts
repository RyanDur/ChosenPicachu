import type {Locator, Page} from '@playwright/test';
import {clickWhereItIs} from './scrolling';

export type SortChoice = 'name' | 'date' | 'size';

export const trappedMenu = (page: Page) => {
  const trap = page.getByRole('figure', {name: /^The trap\./});
  const sortBy = trap.getByRole('button', {name: /^Sort by(: \w+)?, the old way$/});
  const choice = (name: SortChoice) => trap.getByRole('menuitem', {name});
  return {
    sortBy,
    choice,
    contextChoice: trap.getByRole('checkbox', {name: 'Card one has z-index: 1'}),
    contextWords: trap.getByText('Card one has z-index: 1', {exact: true}),
    caption: trap.getByText(/A list with z-index: 9999 opens under a card with z-index: 1/),
    said: trap.getByRole('status', {name: 'where the list opened'}),
    open: (): Promise<void> => sortBy.click(),
    openByKeyboard: async (): Promise<void> => {
      await sortBy.focus();
      await page.keyboard.press('Enter');
    },
    onTopAt: async (name: SortChoice): Promise<string> => choice(name).evaluate((element, cardTwo) => {
      element.scrollIntoView({block: 'center'});
      const {left, top, width, height} = element.getBoundingClientRect();
      const topmost = document.elementFromPoint(left + width / 2, top + height / 2);
      if (element.contains(topmost)) {
        return 'the choice';
      }
      return cardTwo?.contains(topmost) ?? false ? 'card two' : 'something else';
    }, await trap.getByRole('listitem').filter({hasText: /^Card two has z-index/}).elementHandle())
  };
};

export const topLayerMenu = (page: Page) => {
  const trap = page.getByRole('figure', {name: /^The trap\./});
  const sortBy = trap.getByRole('button', {name: /^Sort by(: \w+)?, in the top layer$/});
  const menu = page.getByLabel('Sort by, in the top layer', {exact: true}).and(page.getByRole('list'));
  const choice = (name: SortChoice) => menu.getByRole('button', {name, exact: true});
  return {
    sortBy,
    menu,
    choice,
    open: async (): Promise<void> => {
      await sortBy.evaluate(button => button.scrollIntoView({block: 'center'}));
      // Playwright's click retries a button it finds unstable by scrolling it to the view's edge, where the list opens upward
      await clickWhereItIs(page, sortBy);
    },
    openFromTheBottomEdge: async (): Promise<void> => {
      await sortBy.evaluate(button => button.scrollIntoView({block: 'end'}));
      await clickWhereItIs(page, sortBy);
    },
    onTopAt: (name: SortChoice): Promise<boolean> => choice(name).evaluate(element => {
      // WebKit scrolls even a choice already in view to the centre, which moves Sort by off the edge it was pressed at
      element.scrollIntoView({block: 'nearest'});
      const {left, top, width, height} = element.getBoundingClientRect();
      return element.contains(document.elementFromPoint(left + width / 2, top + height / 2));
    })
  };
};

export const bannerTrap = (page: Page) => {
  const trap = page.getByRole('figure', {name: /^The banners\./});
  const cardTwo = trap.getByRole('listitem').filter({hasText: /^Card two has z-index/});
  const oldBanner = page.getByRole('alert').filter({hasText: /^An old banner\./});
  const topLayerBanner = page.getByRole('alert').filter({hasNot: page.getByText(/^An old banner\./)}).getByRole('listitem').last();
  return {
    raiseOld: trap.getByRole('button', {name: 'Raise a banner, the old way'}),
    raiseNew: trap.getByRole('button', {name: 'Raise a banner, in the top layer'}),
    oldBanner,
    topLayerBanner,
    dismissOld: page.getByRole('button', {name: 'dismiss the old banner'}),
    scrollCardTwoOnto: async (banner: Locator): Promise<void> => {
      const [card, strip] = await Promise.all([cardTwo.boundingBox(), banner.boundingBox()]);
      await page.mouse.wheel(0, (card?.y ?? 0) + (card?.height ?? 0) / 2 - (strip?.y ?? 0) - (strip?.height ?? 0) / 2);
    },
    onTopOf: async (banner: Locator, where: 'middle' | 'start'): Promise<string> => banner.evaluate((element, {at, card}) => {
      const {left, top, width, height} = element.getBoundingClientRect();
      const topmost = document.elementFromPoint(at === 'middle' ? left + width / 2 : left + 2, top + height / 2);
      if (element.contains(topmost)) {
        return 'the banner';
      }
      return card?.contains(topmost) ?? false ? 'card two' : 'something else';
    }, {at: where, card: await cardTwo.elementHandle()})
  };
};

import type {Locator, Page} from '@playwright/test';

export type SortChoice = 'name' | 'date' | 'size';

export const trappedMenu = (page: Page) => {
  const trap = page.getByRole('figure', {name: /^The trap\./});
  const sortBy = trap.getByRole('button', {name: /^Sort by(: \w+)?$/});
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
      element.scrollIntoView({block: 'center'});
      const {left, top, width, height} = element.getBoundingClientRect();
      const topmost = document.elementFromPoint(left + width / 2, top + height / 2);
      if (element.contains(topmost)) {
        return 'the choice';
      }
      return cardTwo?.contains(topmost) ?? false ? 'card two' : 'something else';
    }, await trap.getByRole('listitem').filter({hasText: /^Card two\./}).elementHandle())
  };
};

export const topLayerMenu = (page: Page) => {
  const trap = page.getByRole('figure', {name: /^The trap\./});
  const sortBy = trap.getByRole('button', {name: /^Sort by, in the top layer/});
  const menu = page.getByLabel('Sort by, in the top layer', {exact: true}).and(page.getByRole('list'));
  const choice = (name: SortChoice) => menu.getByRole('button', {name, exact: true});
  return {
    sortBy,
    menu,
    choice,
    open: (): Promise<void> => sortBy.click(),
    overlapsCardTwo: async (): Promise<boolean> => {
      const [list, cardTwo] = await Promise.all([menu.boundingBox(), trap.getByRole('listitem').filter({hasText: /^Card two\./}).boundingBox()]);
      return list !== null && cardTwo !== null &&
        list.y < cardTwo.y + cardTwo.height && cardTwo.y < list.y + list.height &&
        list.x < cardTwo.x + cardTwo.width && cardTwo.x < list.x + list.width;
    },
    onTopAt: (name: SortChoice): Promise<boolean> => choice(name).evaluate(element => {
      element.scrollIntoView({block: 'center'});
      const {left, top, width, height} = element.getBoundingClientRect();
      return element.contains(document.elementFromPoint(left + width / 2, top + height / 2));
    })
  };
};

export const bannerTrap = (page: Page) => {
  const trap = page.getByRole('figure', {name: /^The banners\./});
  const cardTwo = trap.getByRole('listitem').filter({hasText: /^Card two\./});
  const oldBanner = page.getByRole('alert').filter({hasText: /^An old banner\./});
  const topLayerBanner = page.getByRole('alert').filter({hasNot: page.getByText(/^An old banner\./)}).getByRole('listitem').last();
  return {
    raiseOld: trap.getByRole('button', {name: 'Raise the old banner'}),
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

import {maybe, not} from '@ryandur/sand';
import type {Locator, Page} from '@playwright/test';
import {assertionPatience} from './patience';

export type SortChoice = 'name' | 'date' | 'size';

export type Worn = 'nothing' | 'position: relative' | 'outline' | 'z-index: 1' | 'opacity: 0.9' | 'transform: rotate(-1deg)' | 'isolation: isolate';

const untilPressable = (control: Locator): Promise<void> => control.click({trial: true});

const oldWaySortBy = (figure: Locator) => {
  const sortBy = figure.getByRole('button', {name: /^Sort by(: \w+)?, the old way$/});
  const choice = (name: SortChoice) => figure.getByRole('menuitem', {name});
  return {
    sortBy,
    choice,
    open: (): Promise<void> => sortBy.click(),
    onTopAt: async (name: SortChoice): Promise<string> => choice(name).evaluate((element, cardTwo) => {
      element.scrollIntoView({block: 'center'});
      const {left, top, width, height} = element.getBoundingClientRect();
      const topmost = document.elementFromPoint(left + width / 2, top + height / 2);
      if (element.contains(topmost)) {
        return 'the choice';
      }
      return cardTwo?.contains(topmost) ?? false ? 'card two' : 'something else';
    }, await figure.getByRole('listitem').filter({hasText: /^Card two has z-index/}).elementHandle())
  };
};

export const contextChooser = (page: Page) => {
  const chooser = page.getByRole('region', {name: 'What card one wears'});
  const menu = oldWaySortBy(chooser);
  return {
    ...menu,
    heading: chooser.getByRole('heading', {name: 'What card one wears'}),
    openByKeyboard: async (): Promise<void> => {
      await untilPressable(menu.sortBy);
      await menu.sortBy.focus();
      await page.keyboard.press('Enter');
    },
    wearing: (worn: Worn) => chooser.getByRole('radio', {name: worn, exact: true}),
    chosen: (worn: Worn) => chooser.getByRole('radio', {name: worn, exact: true, checked: true}),
    said: chooser.getByRole('status', {name: 'what card one formed'})
  };
};

const withinAMoment = (waiting: Promise<unknown>): Promise<boolean> => waiting.then(() => true, () => false);

const nextFrame = (page: Page): Promise<void> =>
  page.evaluate(() => new Promise<void>(drawn => requestAnimationFrame(() => drawn())));

const settledWithinAMoment = async (page: Page, read: () => Promise<string>, want: string): Promise<string> => {
  const deadline = Date.now() + assertionPatience;
  let seen = await read();
  while (seen !== want && Date.now() < deadline) {
    await nextFrame(page);
    seen = await read();
  }
  return seen;
};

export const wearsReportedWrong = async (page: Page, whereTheListOpens: readonly (readonly [Worn, 'over' | 'under'])[]): Promise<string[]> => {
  const chooser = contextChooser(page);
  const wrong: string[] = [];
  for (const [worn, where] of whereTheListOpens) {
    await chooser.wearing(worn).click();
    if (not(await withinAMoment(chooser.chosen(worn).waitFor({timeout: assertionPatience})))) {
      wrong.push(`${worn}: not chosen`);
    }
    await chooser.open();
    const onTop = where === 'over' ? 'the choice' : 'card two';
    const seen = await settledWithinAMoment(page, () => chooser.onTopAt('date'), onTop);
    if (seen !== onTop) {
      wrong.push(`${worn}: ${seen} on top at date, not ${onTop}`);
    }
    if (not(await withinAMoment(chooser.said.filter({hasText: `${where} card two`}).waitFor({timeout: assertionPatience})))) {
      wrong.push(`${worn}: said "${maybe(await chooser.said.textContent()).orElse('')}", not ${where} card two`);
    }
    await page.keyboard.press('Escape');
  }
  return wrong;
};

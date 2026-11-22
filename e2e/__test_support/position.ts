import type {Locator, Page} from '@playwright/test';
import {not} from '@ryandur/sand';
import {type Box, boxOf} from './box';
import {pillSwitch} from './pills';
import {siteFrame} from './site';

type Position = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
type ParentPosition = 'position: relative' | 'not positioned';
type Spot = {x: number; y: number};
type Placed = Spot & {measuredFromFirstsHolder: boolean};

const cornerOf = async (box: Locator): Promise<Spot> => {
  const {x, y} = await boxOf(box);
  return {x, y};
};

const cornerIn = (holder: Box, box: Spot): Spot => ({
  x: Math.round(box.x - holder.x),
  y: Math.round(box.y - holder.y)
});

const exactly = (text: string): RegExp => new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);

export const positionExhibit = (page: Page) => {
  const exhibit = page.getByRole('figure', {name: /^Where Second goes\./});
  const littlePage = exhibit.getByRole('region', {name: 'The little page'});
  const positionPills = pillSwitch(page, 'Second’s position is');
  const parentPills = pillSwitch(page, 'And its parent is');
  const whereSecondWent = exhibit.getByRole('status', {name: 'where Second went'});
  const shownOnceChosen = async (pill: Locator, choose: () => Promise<void>): Promise<void> => {
    if (await pill.isChecked()) return;
    const before = await whereSecondWent.textContent() ?? '';
    await choose();
    await whereSecondWent.filter({hasNotText: exactly(before)}).waitFor();
  };
  const spotOf = async (name: string): Promise<Spot> => {
    const [namedCorner, pageCorner] = await Promise.all([
      cornerOf(littlePage.getByText(name, {exact: true})),
      cornerOf(littlePage)
    ]);
    return {x: Math.round(namedCorner.x - pageCorner.x), y: Math.round(namedCorner.y - pageCorner.y)};
  };
  return {
    chooses: (position: Position): Promise<void> =>
      shownOnceChosen(positionPills.pill(position), () => positionPills.choose(position)),
    stepsByKeyboard: async (steps: number): Promise<void> => {
      await siteFrame(page).hydrated();
      await positionPills.pill('static').focus();
      for (let step = 0; step < steps; step += 1) {
        await page.keyboard.press('ArrowRight');
      }
    },
    pill: (position: Position): Locator => positionPills.pill(position),
    tabsToTheLittlePage: async (): Promise<void> => {
      await siteFrame(page).hydrated();
      await positionPills.pill('static').focus();
      const reached = (): Promise<boolean> => littlePage.evaluate(littlePage => littlePage === document.activeElement);
      for (let presses = 0; presses < 12 && not(await reached()); presses += 1) {
        await page.keyboard.press('Tab');
      }
    },
    littlePage,
    choosesParent: (position: ParentPosition): Promise<void> =>
      shownOnceChosen(parentPills.pill(position), () => parentPills.choose(position)),
    parentPill: (position: ParentPosition): Locator => parentPills.pill(position),
    spotOf,
    oldPlaceOf: async (name: string): Promise<Spot[]> => {
      const holder = await boxOf(littlePage);
      const outlines = await littlePage.getByText(name, {exact: true})
        .evaluate(box => [...box.children].map(outline => {
          const {x, y} = outline.getBoundingClientRect();
          return {x, y};
        }));
      return outlines.map(outline => cornerIn(holder, outline));
    },
    placedFromItsHolder: (name: string): Promise<Placed> => littlePage.getByText(name, {exact: true}).evaluate(box => {
      const holder = box instanceof HTMLElement ? box.offsetParent : null;
      return {
        x: box instanceof HTMLElement ? box.offsetLeft : Number.NaN,
        y: box instanceof HTMLElement ? box.offsetTop : Number.NaN,
        measuredFromFirstsHolder: [...holder?.children ?? []].some(child => child.textContent === 'First')
      };
    }),
    scrollsTheLittlePageTo: (top: number): Promise<void> =>
      littlePage.evaluate((littlePage, to) => littlePage.scrollTo({top: to, behavior: 'instant'}), top),
    scrollsTheLittlePageToItsEnd: (): Promise<void> =>
      littlePage.evaluate(littlePage => littlePage.scrollTo({top: littlePage.scrollHeight, behavior: 'instant'}))
  };
};

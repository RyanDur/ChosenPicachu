import type {Locator, Page} from '@playwright/test';
import {not} from '@ryandur/sand';
import {type Box, boxOf} from './box';
import {pillSwitch} from './pills';
import {siteFrame} from './site';

type Position = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
type ParentPosition = 'position: relative' | 'not positioned';
type Spot = {x: number; y: number};
type Placed = Spot & {measuredFromFirstsHolder: boolean};
type Place = Spot & {width: number; height: number};

const cornerOf = async (box: Locator): Promise<Spot> => {
  const {x, y} = await boxOf(box);
  return {x, y};
};

const placeIn = (holder: Box, box: Box): Place => ({
  x: Math.round(box.x - holder.x),
  y: Math.round(box.y - holder.y),
  width: Math.round(box.width),
  height: Math.round(box.height)
});

export const positionExhibit = (page: Page) => {
  const exhibit = page.getByRole('figure', {name: /^Where Second goes\./});
  const littlePage = exhibit.getByRole('region', {name: 'The little page'});
  const positionPills = pillSwitch(page, 'Second’s position is');
  const spotOf = async (name: string): Promise<Spot> => {
    const [namedCorner, pageCorner] = await Promise.all([
      cornerOf(littlePage.getByText(name, {exact: true})),
      cornerOf(littlePage)
    ]);
    return {x: Math.round(namedCorner.x - pageCorner.x), y: Math.round(namedCorner.y - pageCorner.y)};
  };
  return {
    chooses: (position: Position): Promise<void> => positionPills.choose(position),
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
      const reached = (): Promise<boolean> => littlePage.evaluate(view => view === document.activeElement);
      for (let presses = 0; presses < 12 && not(await reached()); presses += 1) {
        await page.keyboard.press('Tab');
      }
    },
    littlePage,
    choosesParent: (position: ParentPosition): Promise<void> => pillSwitch(page, 'And its parent is').choose(position),
    spotOf,
    placeOf: async (name: string): Promise<Place> =>
      placeIn(await boxOf(littlePage), await boxOf(littlePage.getByText(name, {exact: true}))),
    oldPlaceOf: async (name: string): Promise<Place[]> => {
      const holder = await boxOf(littlePage);
      const marks = await littlePage.getByText(name, {exact: true}).evaluate(box => [...box.children].map(mark => {
        const {x, y, width, height} = mark.getBoundingClientRect();
        return {x, y, width, height};
      }));
      return marks.map(mark => placeIn(holder, mark));
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
      littlePage.evaluate((view, to) => view.scrollTo({top: to, behavior: 'instant'}), top),
    scrollsTheLittlePageToItsEnd: (): Promise<void> =>
      littlePage.evaluate(view => view.scrollTo({top: view.scrollHeight, behavior: 'instant'})),
    css: exhibit.getByRole('figure').filter({hasText: /^CSS/}),
    html: exhibit.getByRole('figure').filter({hasText: /^HTML/}),
    verdict: exhibit.getByRole('status', {name: 'where Second went'}),
    measuredFrom: exhibit.getByRole('status', {name: 'what Second is measured from'})
  };
};

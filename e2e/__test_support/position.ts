import type {Locator, Page} from '@playwright/test';
import {maybe} from '@ryandur/sand';
import {pillSwitch} from './pills';
import {siteFrame} from './site';

export type Position = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
export type ParentPosition = 'position: relative' | 'not positioned';
export type Spot = {x: number; y: number};

const unmeasured = {x: Number.NaN, y: Number.NaN, width: 0, height: 0};

const cornerOf = async (box: Locator): Promise<Spot> => {
  const {x, y} = maybe(await box.boundingBox()).orElse(unmeasured);
  return {x, y};
};

export const positionExhibit = (page: Page) => {
  const exhibit = page.getByRole('figure', {name: /^Where Second goes\./});
  const littlePage = exhibit.getByRole('region', {name: 'The little page'});
  const positionPills = pillSwitch(page, 'Second’s position is');
  const spotOf = async (name: string): Promise<Spot> => {
    const [box, window] = await Promise.all([
      cornerOf(littlePage.getByText(name, {exact: true})),
      cornerOf(littlePage)
    ]);
    return {x: Math.round(box.x - window.x), y: Math.round(box.y - window.y)};
  };
  return {
    choosesPosition: (position: Position): Promise<void> => positionPills.choose(position),
    stepsThroughPositionsByKeyboard: async (steps: number): Promise<void> => {
      await siteFrame(page).hydrated();
      await positionPills.pill('static').focus();
      for (let step = 0; step < steps; step += 1) {
        await page.keyboard.press('ArrowRight');
      }
    },
    position: (position: Position): Locator => positionPills.pill(position),
    choosesParent: (position: ParentPosition): Promise<void> => pillSwitch(page, 'And its parent is').choose(position),
    spotOf,
    scrollsTheLittlePageTo: (top: number): Promise<void> =>
      littlePage.evaluate((view, to) => view.scrollTo({top: to, behavior: 'instant'}), top),
    scrollsTheLittlePageToItsEnd: (): Promise<void> =>
      littlePage.evaluate(view => view.scrollTo({top: view.scrollHeight, behavior: 'instant'})),
    css: exhibit.getByRole('figure').filter({hasText: /^CSS/}),
    measuredFrom: exhibit.getByText(/^Measured from:/)
  };
};

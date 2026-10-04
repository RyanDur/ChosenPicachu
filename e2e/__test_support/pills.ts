import type {Locator, Page} from '@playwright/test';
import {decodedShot} from './shots';

type Pill = {name: string; chosen: boolean; x: number; y: number; width: number; height: number};

// a pill's words take a sliver of it, so a pill painted mostly dark is a dark ground, and dark words on it are lost
const mostly = 0.5;

export const pillSwitch = (page: Page, name: string) => {
  const group = page.getByRole('group', {name, exact: true}).first();

  const paintedWrong = async (): Promise<string[]> => {
    const ground = await group.boundingBox();
    const pills: Pill[] = (await group.getByRole('radio', {includeHidden: true}).evaluateAll(radios => radios.flatMap(radio => {
      const label = radio instanceof HTMLInputElement ? radio.labels?.item(0) : null;
      if (!(radio instanceof HTMLInputElement) || !label) return [];
      const {x, y, width, height} = label.getBoundingClientRect();
      return [{name: label.textContent.trim(), chosen: radio.checked, x, y, width, height}];
    }))).map(pill => ({...pill, x: pill.x - (ground?.x ?? 0), y: pill.y - (ground?.y ?? 0)}));
    const {width, rgba} = await decodedShot(page, await group.screenshot({scale: 'css'}));
    const darkShares = pills.map(({x, y, width: across, height}) => {
      let dark = 0;
      let counted = 0;
      for (let row = Math.round(y); row < Math.round(y + height); row++) {
        for (let column = Math.round(x); column < Math.round(x + across); column++) {
          const at = (row * width + column) * 4;
          if (0.2126 * rgba[at] + 0.7152 * rgba[at + 1] + 0.0722 * rgba[at + 2] < 60) dark++;
          counted++;
        }
      }
      return dark / Math.max(1, counted);
    });
    return pills.flatMap(({name, chosen}, at) => {
      const dark = darkShares[at] > mostly;
      if (chosen && !dark) return [`${name}, chosen, painted light`];
      if (!chosen && dark) return [`${name}, not chosen, painted dark`];
      return [];
    });
  };

  return {
    choose: (pill: string): Promise<void> => group.getByText(pill, {exact: true}).click(),
    hover: (pill: string): Promise<void> => group.getByText(pill, {exact: true}).hover(),
    pill: (name: string): Locator => group.getByRole('radio', {name, includeHidden: true}),
    stillMoving: (): Promise<number> => group.evaluate(element => element.getAnimations({subtree: true})
      .filter(animation => animation.playState === 'running').length),
    paintedWrong,
    paintedWrongFor: async (milliseconds: number): Promise<string[]> => {
      const seen = new Set<string>();
      for (const start = Date.now(); Date.now() - start < milliseconds;) {
        (await paintedWrong()).forEach(wrong => seen.add(wrong));
      }
      return [...seen];
    }
  };
};

export const shownPillSwitches = async (page: Page, names: string[]): Promise<string[]> => {
  const shown = await Promise.all(names.map(name => page.getByRole('group', {name, exact: true}).first().isVisible()));
  return names.filter((_, at) => shown[at]);
};

export const dialRow = (page: Page, name: string) => {
  const pills = page.getByRole('group', {name, exact: true}).last();
  const row = page.getByRole('listitem').filter({has: pills}).last();
  return {row, pills, reading: row.getByRole('status'), shownNames: row.getByText(name, {exact: true})};
};

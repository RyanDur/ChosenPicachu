import type {Page} from '@playwright/test';

type Pill = {name: string; chosen: boolean; x: number; y: number; width: number; height: number};

// a pill's words take a sliver of it, so a pill painted mostly dark is a dark ground, and dark words on it are lost
const mostly = 0.5;

export const pillSwitch = (page: Page, name: string) => {
  const group = page.getByRole('group', {name, exact: true}).first();
  return {
    choose: (pill: string): Promise<void> => group.getByText(pill, {exact: true}).click(),
    stillMoving: (): Promise<number> => group.evaluate(element => element.getAnimations({subtree: true})
      .filter(animation => animation.playState === 'running').length),
    paintedWrong: async (): Promise<string[]> => {
      const pills: Pill[] = await group.evaluate(element => {
        const ground = element.getBoundingClientRect();
        return [...element.querySelectorAll('input[type="radio"]')].flatMap(radio => {
          const label = radio instanceof HTMLInputElement ? radio.labels?.item(0) : null;
          if (!(radio instanceof HTMLInputElement) || !label) return [];
          const {x, y, width, height} = label.getBoundingClientRect();
          return [{name: label.textContent.trim(), chosen: radio.checked, x: x - ground.x, y: y - ground.y, width, height}];
        });
      });
      const shot = (await group.screenshot({scale: 'css'})).toString('base64');
      const darkShares: number[] = await page.evaluate(async ({src, boxes}) => {
        const image = new Image();
        image.src = `data:image/png;base64,${src}`;
        await image.decode();
        const canvas = new OffscreenCanvas(image.width, image.height);
        const context = canvas.getContext('2d');
        context?.drawImage(image, 0, 0);
        return boxes.map(({x, y, width, height}) => {
          const pixels = context?.getImageData(Math.round(x), Math.round(y), Math.round(width), Math.round(height)).data ?? new Uint8ClampedArray();
          let dark = 0;
          for (let at = 0; at < pixels.length; at += 4) {
            if (0.2126 * pixels[at] + 0.7152 * pixels[at + 1] + 0.0722 * pixels[at + 2] < 60) dark++;
          }
          return dark / Math.max(1, pixels.length / 4);
        });
      }, {src: shot, boxes: pills});
      return pills.flatMap(({name, chosen}, at) => {
        const dark = darkShares[at] > mostly;
        if (chosen && !dark) return [`${name}, chosen, painted light`];
        if (!chosen && dark) return [`${name}, not chosen, painted dark`];
        return [];
      });
    }
  };
};

export const shownPillSwitches = async (page: Page, names: string[]): Promise<string[]> => {
  const shown = await Promise.all(names.map(name => page.getByRole('group', {name, exact: true}).first().isVisible()));
  return names.filter((_, at) => shown[at]);
};

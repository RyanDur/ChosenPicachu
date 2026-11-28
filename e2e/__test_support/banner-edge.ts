import type {Page} from '@playwright/test';
import {pressTab} from './keyboard';
import {siteFrame} from './site';
import {pillSwitch} from './pills';

type BannerStep = '1 · Written in a card' | '2 · Moved to the page' | '3 · A bigger number arrives';
type OnTop = 'the banner' | 'card two' | 'neither' | 'not drawn yet';
type OnTheBannersEnd = 'the banner' | 'the help button' | 'neither' | 'not drawn yet';

export const bannerAtTheEdge = (page: Page) => {
  const exhibit = page.getByRole('region', {name: 'A fixed banner, in a card and on the page', exact: true});
  const littlePage = exhibit.getByRole('region', {name: 'The little page'});
  const steps = pillSwitch(page, 'Step');
  const labelOf = {banner: littlePage.getByText('Banner · 9999', {exact: true}), cardTwo: littlePage.getByText('Card two · 1', {exact: true})};
  const dismiss = littlePage.getByRole('button', {name: 'Dismiss the banner'});
  const help = littlePage.getByRole('button', {name: 'Help · 10000'});
  return {
    stepsTo: (step: BannerStep): Promise<void> => steps.choose(step),
    verdict: exhibit.getByRole('status', {name: 'what the browser drew'}),
    tabStopsInTheLittlePage: async (): Promise<string[]> => {
      await siteFrame(page).hydrated();
      await littlePage.focus();
      const stops = await littlePage.getByRole('button').count();
      const reached: string[] = [];
      for (let stop = 0; stop < stops; stop += 1) {
        await pressTab(page);
        reached.push(await page.evaluate(() => {
          const focused = document.activeElement;
          return focused?.getAttribute('aria-label') ?? focused?.textContent?.trim() ?? '';
        }));
      }
      return reached;
    },
    onTopAtTheBannersEnd: async (): Promise<OnTheBannersEnd> => {
      if (await dismiss.count() !== 1) return 'not drawn yet';
      const [helpButton] = await help.elementHandles();
      await littlePage.scrollIntoViewIfNeeded();
      return dismiss.evaluate((button, helpDrawn): OnTheBannersEnd => {
        const box = button.getBoundingClientRect();
        const hit = document.elementFromPoint((box.left + box.right) / 2, (box.top + box.bottom) / 2);
        const holds = (drawn?: Node | null): boolean => drawn?.contains(hit) ?? false;
        return holds(button.parentElement) ? 'the banner' : holds(helpDrawn) ? 'the help button' : 'neither';
      }, helpButton);
    },
    onTopWhereCardTwoMeetsTheBanner: async (): Promise<OnTop> => {
      if (await labelOf.banner.count() !== 1 || await labelOf.cardTwo.count() !== 1) return 'not drawn yet';
      const labels = await Promise.all([labelOf.banner.elementHandle(), labelOf.cardTwo.elementHandle()]);
      await littlePage.scrollIntoViewIfNeeded();
      return littlePage.evaluate((_, [bannerLabel, cardLabel]): OnTop => {
        const [banner, card] = [bannerLabel?.parentElement, cardLabel?.parentElement];
        if (!banner || !card) return 'not drawn yet';
        const [bannerBox, cardBox] = [banner.getBoundingClientRect(), card.getBoundingClientRect()];
        const hit = document.elementFromPoint(
          (Math.max(bannerBox.left, cardBox.left) + Math.min(bannerBox.right, cardBox.right)) / 2,
          (Math.max(bannerBox.top, cardBox.top) + Math.min(bannerBox.bottom, cardBox.bottom)) / 2);
        return banner.contains(hit) ? 'the banner' : card.contains(hit) ? 'card two' : 'neither';
      }, labels);
    }
  };
};

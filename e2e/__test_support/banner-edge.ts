import type {Locator, Page} from '@playwright/test';
import {pressTab} from './keyboard';
import {siteFrame} from './site';
import {pillSwitch} from './pills';

type BannerStep = '1 · Written in a card' | '2 · Moved to the page';
type OnTop = 'the banner' | 'card two' | 'neither' | 'not drawn yet';

export const bannerAtTheEdge = (page: Page) => {
  const exhibit = page.getByRole('region', {name: 'The banner at the window’s edge', exact: true});
  const littlePage = exhibit.getByRole('region', {name: 'The little page'});
  const steps = pillSwitch(page, 'Step');
  const panel = (label: string): Locator => exhibit.getByRole('figure').filter({hasText: new RegExp(`^${label}`)});
  const linesOf = (label: string) => async (): Promise<string[]> =>
    (await panel(label).getByRole('code').textContent() ?? '').split('\n').map(line => line.trim()).filter(Boolean);
  const markedIn = (label: string) => (): Promise<string[]> => panel(label)
    .evaluate(sample => [...sample.querySelectorAll('mark')].map(marked => marked.textContent?.trim() ?? ''));
  return {
    stepsTo: (step: BannerStep): Promise<void> => steps.choose(step),
    step: (step: BannerStep): Locator => steps.pill(step),
    verdict: exhibit.getByRole('status', {name: 'what the browser drew'}),
    html: linesOf('HTML'),
    markedHtml: markedIn('HTML'),
    css: linesOf('CSS'),
    tabStopsInTheLittlePage: async (): Promise<string[]> => {
      await siteFrame(page).hydrated();
      await littlePage.focus();
      const reached: string[] = [];
      for (let stop = 0; stop < 3; stop += 1) {
        await pressTab(page);
        reached.push(await page.evaluate(() => {
          const focused = document.activeElement;
          return focused?.getAttribute('aria-label') ?? focused?.textContent?.trim() ?? '';
        }));
      }
      return reached;
    },
    onTopOnceCardTwoScrollsToTheBanner: (): Promise<OnTop> => littlePage.evaluate((scrolled): OnTop => {
      scrolled.scrollIntoView({block: 'center'});
      const named = (words: string): Element | undefined => [...scrolled.querySelectorAll('p, section')]
        .find(box => box.firstElementChild?.textContent?.trim() === words);
      const [banner, card] = [named('Banner · 9999'), named('Card two · 1')];
      if (!banner || !card) return 'not drawn yet';
      const middle = (box: DOMRect): number => (box.top + box.bottom) / 2;
      scrolled.scrollBy({top: middle(card.getBoundingClientRect()) - middle(banner.getBoundingClientRect()), behavior: 'instant'});
      const [bannerBox, cardBox] = [banner.getBoundingClientRect(), card.getBoundingClientRect()];
      const hit = document.elementFromPoint(
        (Math.max(bannerBox.left, cardBox.left) + Math.min(bannerBox.right, cardBox.right)) / 2,
        (Math.max(bannerBox.top, cardBox.top) + Math.min(bannerBox.bottom, cardBox.bottom)) / 2);
      return banner.contains(hit) ? 'the banner' : card.contains(hit) ? 'card two' : 'neither';
    })
  };
};

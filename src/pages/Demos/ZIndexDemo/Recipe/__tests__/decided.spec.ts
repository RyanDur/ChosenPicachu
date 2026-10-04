import bannersCss from '@components/Banners/Banners.css?raw';
import {
  arriveDistance, arriveStart, closedGap, closedSlot, closingGapTransition, closingTransition, flatNews, gapTransition,
  newsClosingTransition, newsShrinks, newsTransition, openingTransition, ownedGap, slideOutTransition, slideTransition, slotTrack
} from '../decided';

const declarationsOf = (record: Record<string, string>): string[][] =>
  Object.entries(record).map(([choice, declaration]) => [choice, declaration]);

describe('the decided-world fragments still tell the truth of Banners.css', () => {
  test.each([
    ...declarationsOf(arriveDistance),
    ...declarationsOf(slotTrack),
    ...declarationsOf(closedSlot),
    ...declarationsOf(closedGap),
    ...declarationsOf(closingTransition),
    ...declarationsOf(openingTransition),
    ...declarationsOf(gapTransition),
    ...declarationsOf(closingGapTransition)
  ])('the %s banner wears the declaration Banners.css gives it: %s', (_choice, declaration) => {
    expect(bannersCss).toContain(declaration);
  });

  test.each([arriveStart, slideTransition, slideOutTransition, newsShrinks, newsTransition, ...newsClosingTransition])(
    'every banner wears the declaration Banners.css gives it: %s', declaration => {
      expect(bannersCss).toContain(declaration);
    });

  test.each(Object.entries(flatNews))('a %s stack flattens its message as Banners.css writes it', (_stack, declarations) => {
    declarations.forEach(declaration => expect(bannersCss).toContain(declaration));
  });

  test.each(declarationsOf(ownedGap))('the %s stack owns its gap, as Banners.css writes it', (_choice, rule) => {
    const [selector, declaration] = rule.split(' { ');
    expect(bannersCss).toContain(selector.replace('.trouble', '.trouble:where('));
    expect(bannersCss).toContain(declaration.replace(' }', ''));
  });
});

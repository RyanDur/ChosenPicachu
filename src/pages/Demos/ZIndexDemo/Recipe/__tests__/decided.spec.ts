import bannersCss from '@components/Banners/Banners.css?raw';
import {arriveDistance, closedGap, closedSlot, closingGapTransition, closingTransition, gapTransition, openingTransition, ownedGap, slotTrack} from '../decided';

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

  test.each([
    'translate 0.6s cubic-bezier(0.45, 0, 0.15, 1) 0.3s,',
    'translate: var(--arrive);'
  ])('the banner slides in as Banners.css writes it: %s', declaration => {
    expect(bannersCss).toContain(declaration);
  });

  test.each(declarationsOf(ownedGap))('the %s stack owns its gap, as Banners.css writes it', (_choice, rule) => {
    const [selector, declaration] = rule.split(' { ');
    expect(bannersCss).toContain(selector.replace('.trouble', '.trouble:where('));
    expect(bannersCss).toContain(declaration.replace(' }', ''));
  });
});

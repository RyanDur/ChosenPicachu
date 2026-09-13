import bannersCss from '@components/Banners/Banners.css?raw';
import {
  arriveFrom, closingSlot, closingTransition, ownedGap, slotOpening, slotTrack
} from '../decided';

const declarationsOf = (record: Record<string, string>): string[][] =>
  Object.entries(record).map(([choice, declaration]) => [choice, declaration]);

describe('the decided-world fragments still tell the truth of Banners.css', () => {
  test.each([
    ...declarationsOf(arriveFrom),
    ...declarationsOf(slotTrack),
    ...declarationsOf(slotOpening),
    ...declarationsOf(closingSlot),
    ...declarationsOf(closingTransition)
  ])('the %s banner wears the declaration Banners.css gives it: %s', (_choice, declaration) => {
    expect(bannersCss).toContain(declaration);
  });

  test.each(declarationsOf(ownedGap))('the %s stack owns its gap, as Banners.css writes it', (_choice, rule) => {
    const [selector, declaration] = rule.split(' { ');
    expect(bannersCss).toContain(selector.replace('.trouble', '.trouble:where('));
    expect(bannersCss).toContain(declaration.replace(' }', ''));
  });
});

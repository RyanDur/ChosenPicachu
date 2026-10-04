import bannersCss from '@components/Banners/Banners.css?sample';
import {not} from '@ryandur/sand';
import {span} from '../../../Recipe/carve';
import {
  arrivalLines, leavingLines, slotLines,
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
    expect(bannersCss.text).toContain(declaration);
  });

  test.each([slideTransition, slideOutTransition, newsTransition, ...newsClosingTransition, ...Object.values(newsShrinks)])(
    'every banner wears the declaration Banners.css gives it: %s', declaration => {
      expect(bannersCss.text).toContain(declaration);
    });

  test.each(Object.entries(flatNews))('a %s stack starts its message flat, inside the message’s own starting style', (stack, declarations) => {
    const axis = ['left', 'right'].includes(stack) ? '&:where(.stack-left, .stack-right) .news {' : '&:where(.stack-down, .stack-up) .news {';
    const startingStyle = span(bannersCss, axis, '}').map(line => line.text).join('\n');
    expect(startingStyle).toContain('@starting-style');
    declarations.forEach(declaration => expect(startingStyle).toContain(declaration));
  });

  test('the banner starts at its distance inside the banner’s own starting style', () => {
    const banner = span(bannersCss, '  .trouble {', '    }').map(line => line.text).join('\n');

    expect(banner).toContain('@starting-style');
    expect(banner).toContain(arriveStart);
  });

  test.each(declarationsOf(ownedGap))('the %s stack owns its gap, as Banners.css writes it', (_choice, rule) => {
    const [selector, declaration] = rule.split(' { ');
    expect(bannersCss.text).toContain(selector.replace('.trouble', '.trouble:where('));
    expect(bannersCss.text).toContain(declaration.replace(' }', ''));
  });
});

describe('the decided-world samples point at the lines of Banners.css they show', () => {
  const fileLines = bannersCss.text.split('\n').map(line => line.trim());
  const stacks = ['down', 'up', 'left', 'right'] as const;
  const entrances = ['above', 'below', 'left', 'right'] as const;

  test.each([
    ...entrances.map(enter => [`the ${enter} arrival`, arrivalLines(enter)] as const),
    ...stacks.map(stack => [`the ${stack} slot`, slotLines(stack)] as const),
    ...stacks.map(stack => [`the ${stack} leaving`, leavingLines(stack)] as const)
  ])('should place every line of %s that is a line of the file on that line', (_sample, lines) => {
    const misplaced = lines
      .filter(({text}) => not(/^\s*[{}]?\s*$/.test(text)) && fileLines.includes(text.trim()))
      .filter(({text, from}) => from?.sample !== bannersCss || fileLines[from.line - 1] !== text.trim())
      .map(({text}) => text);

    expect(misplaced).toEqual([]);
  });
});

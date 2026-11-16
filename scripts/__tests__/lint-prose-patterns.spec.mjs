import {describe, expect, it} from 'vitest';
import {
  endsInWord, firstWordOfLine, indentOfLine, lastWordOfLine, lineBreakAhead, spaceClosedAtLineEnd, startsWithMarkup
} from '../lint/prose.mjs';

describe('the prose rule\'s patterns', () => {
  describe('spaceClosedAtLineEnd', () => {
    it('should find a held space whose brace closes before spaces and tabs at the line\'s end', () => {
      expect(spaceClosedAtLineEnd.test('} \t\n')).toBe(true);
    });

    it('should refuse a held space with more on its line after the brace', () => {
      expect(spaceClosedAtLineEnd.test('} said\n')).toBe(false);
    });
  });

  describe('endsInWord', () => {
    it('should find a line ending in a word', () => {
      expect(endsInWord.test('  read the record,')).toBe(true);
    });

    it('should refuse a line ending in a space', () => {
      expect(endsInWord.test('  read the ')).toBe(false);
    });
  });

  describe('startsWithMarkup', () => {
    it('should refuse a line whose markup comes after its first word', () => {
      expect(startsWithMarkup.test('more <i>record</i>')).toBe(false);
    });
  });

  describe('lineBreakAhead', () => {
    it('should take spaces and tabs before the break', () => {
      expect('\t \n  next'.match(lineBreakAhead)?.[0]).toBe('\t \n  ');
    });

    it('should take blank lines that hold spaces and tabs', () => {
      expect('\n \t\n  next'.match(lineBreakAhead)?.[0]).toBe('\n \t\n  ');
    });

    it('should take the next line\'s indent, tabs included', () => {
      expect('\n\t next'.match(lineBreakAhead)?.[1]).toBe('\t ');
    });

    it('should refuse words before the break', () => {
      expect(lineBreakAhead.test('said\n  next')).toBe(false);
    });
  });

  describe('indentOfLine', () => {
    it('should take the line\'s indent, tabs included', () => {
      expect('\t  the record'.match(indentOfLine)?.[0]).toBe('\t  ');
    });
  });

  describe('lastWordOfLine', () => {
    it('should split the last word from what stays, across any run of spaces', () => {
      const found = '  read   the'.match(lastWordOfLine);
      expect([found?.[1], found?.[3]]).toEqual(['  read', 'the']);
    });

    it('should refuse a line of one word', () => {
      expect(lastWordOfLine.test('  the')).toBe(false);
    });

    it('should refuse a line ending in markup', () => {
      expect(lastWordOfLine.test('  read {name}')).toBe(false);
    });

    it('should refuse a line ending in a space', () => {
      expect(lastWordOfLine.test('  read the ')).toBe(false);
    });
  });

  describe('firstWordOfLine', () => {
    it('should split the first word from the rest, across any run of spaces', () => {
      const found = 'says   more'.match(firstWordOfLine);
      expect([found?.[1], found?.[2]]).toEqual(['says', 'more']);
    });

    it('should refuse a line starting with markup', () => {
      expect(firstWordOfLine.test('{it} says')).toBe(false);
    });

    it('should refuse a line of one word', () => {
      expect(firstWordOfLine.test('says')).toBe(false);
    });

    it('should refuse a word with only spaces after it', () => {
      expect(firstWordOfLine.test('says  ')).toBe(false);
    });
  });
});

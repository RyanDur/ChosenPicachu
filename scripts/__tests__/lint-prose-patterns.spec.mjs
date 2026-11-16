import {describe, expect, it} from 'vitest';
import {prose} from '../lint/prose.mjs';

describe('the prose rule\'s patterns', () => {
  describe('spaceClosedAtLineEnd', () => {
    it('should find a held space whose brace closes before spaces and tabs at the line\'s end', () => {
      expect(prose.patterns.spaceClosedAtLineEnd.test('} \t\n')).toBe(true);
    });

    it('should refuse a held space with more on its line after the brace', () => {
      expect(prose.patterns.spaceClosedAtLineEnd.test('} said\n')).toBe(false);
    });
  });

  describe('endsInWord', () => {
    it('should find a line ending in a word', () => {
      expect(prose.patterns.endsInWord.test('  read the record,')).toBe(true);
    });

    it('should refuse a line ending in a space', () => {
      expect(prose.patterns.endsInWord.test('  read the ')).toBe(false);
    });
  });

  describe('startsWithMarkup', () => {
    it('should refuse a line whose markup comes after its first word', () => {
      expect(prose.patterns.startsWithMarkup.test('more <i>record</i>')).toBe(false);
    });
  });

  describe('lineBreakAhead', () => {
    it('should take spaces and tabs before the break', () => {
      expect('\t \n  next'.match(prose.patterns.lineBreakAhead)?.[0]).toBe('\t \n  ');
    });

    it('should take blank lines that hold spaces and tabs', () => {
      expect('\n \t\n  next'.match(prose.patterns.lineBreakAhead)?.[0]).toBe('\n \t\n  ');
    });

    it('should take the next line\'s indent, tabs included', () => {
      expect('\n\t next'.match(prose.patterns.lineBreakAhead)?.[1]).toBe('\t ');
    });

    it('should refuse words before the break', () => {
      expect(prose.patterns.lineBreakAhead.test('said\n  next')).toBe(false);
    });
  });

  describe('indentOfLine', () => {
    it('should take the line\'s indent, tabs included', () => {
      expect('\t  the record'.match(prose.patterns.indentOfLine)?.[0]).toBe('\t  ');
    });
  });

  describe('lastWordOfLine', () => {
    it('should split the last word from what stays, across any run of spaces', () => {
      const found = '  read   the'.match(prose.patterns.lastWordOfLine);
      expect([found?.[1], found?.[3]]).toEqual(['  read', 'the']);
    });

    it('should refuse a line of one word', () => {
      expect(prose.patterns.lastWordOfLine.test('  the')).toBe(false);
    });

    it('should refuse a line ending in markup', () => {
      expect(prose.patterns.lastWordOfLine.test('  read {name}')).toBe(false);
    });

    it('should refuse a line ending in a space', () => {
      expect(prose.patterns.lastWordOfLine.test('  read the ')).toBe(false);
    });
  });

  describe('firstWordOfLine', () => {
    it('should split the first word from the rest, across any run of spaces', () => {
      const found = 'says   more'.match(prose.patterns.firstWordOfLine);
      expect([found?.[1], found?.[2]]).toEqual(['says', 'more']);
    });

    it('should refuse a line starting with markup', () => {
      expect(prose.patterns.firstWordOfLine.test('{it} says')).toBe(false);
    });

    it('should refuse a line of one word', () => {
      expect(prose.patterns.firstWordOfLine.test('says')).toBe(false);
    });

    it('should refuse a word with only spaces after it', () => {
      expect(prose.patterns.firstWordOfLine.test('says  ')).toBe(false);
    });
  });
});

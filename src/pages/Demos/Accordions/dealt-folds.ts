import {seeded} from '@components/fibs';
import {FoldType} from '../ReaderSettings';
import {Fold} from './accordion-props';

const draws = seeded('the accordion exhibits');
const dealt = draws.wordDeck();

const dealFolds = (count: number): Fold[] =>
  Array.from({length: count}, () => ({
    heading: dealt(),
    story: Array.from({length: draws.randNumber({min: 1, max: 6})}, () => draws.randParagraph()).join(' ')
  }));
const measured: Record<FoldType, Fold[]> = {inclusive: dealFolds(5), exclusive: dealFolds(5)};
const known: Record<FoldType, Fold[]> = {inclusive: dealFolds(5), exclusive: dealFolds(5)};
const platform: Record<FoldType, Fold[]> = {inclusive: dealFolds(5), exclusive: dealFolds(5)};
const sliding: Record<FoldType, Fold[]> = {inclusive: dealFolds(5), exclusive: dealFolds(5)};

export const dealtFolds = {measured, known, platform, sliding};

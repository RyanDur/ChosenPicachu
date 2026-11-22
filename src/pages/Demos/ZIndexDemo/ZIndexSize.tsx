import {FC} from 'react';
import {spelled} from '@pages/Record/moments';
import {capitalized} from '../capitalized';
import {zIndexParts} from './part-pages';

const partCount = zIndexParts.inTheBook;
const partCountInWords = capitalized(spelled.out(partCount).orElse(String(partCount)));

export const ZIndexSize: FC = () =>
  <p className="paragraph">{`${partCountInWords} parts, about ${zIndexParts.minutes} minutes.`}</p>;

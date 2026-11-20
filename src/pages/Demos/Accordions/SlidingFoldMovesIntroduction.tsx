import {FC} from 'react';
import {PartLink} from './PartLink';

export const SlidingFoldMovesIntroduction: FC = () =>
  <p className="paragraph">This part builds on two before it: “<PartLink part="a-box-remembers-the-fold"/>”, where a
    transition first moves a fold, and “<PartLink part="what-the-platform-gives-now"/>”, for the details fold it
    slides.</p>;

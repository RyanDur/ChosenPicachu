import {FC} from 'react';
import {PartLink} from './PartLink';

export const MaxHeightGuessIntroduction: FC = () =>
  <p className="paragraph">This part builds on “<PartLink part="a-box-remembers-the-fold"/>”, for the known height
    and the rule that reads the box.</p>;

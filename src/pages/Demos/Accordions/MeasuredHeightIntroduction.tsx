import {FC} from 'react';
import {useControls} from '../Controls';
import {foldInput} from './fold-input';
import {PartLink} from './PartLink';

export const MeasuredHeightIntroduction: FC = () => {
  const input = foldInput.of(useControls().foldType);
  return <p className="paragraph">This part builds on two before it:
    “<PartLink part="a-box-remembers-the-fold"/>”, for the {input} and its label, and
    “<PartLink part="the-max-height-guess"/>”, which this part answers.</p>;
};

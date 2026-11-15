import {FC} from 'react';
import {DialRow, FoldType, useControls} from '../Controls';

const foldTypes = [{words: 'Inclusive', value: 'inclusive'}, {words: 'Exclusive', value: 'exclusive'}] as const;

const readings: Record<FoldType, string> = {
  inclusive: 'Any number of folds can be open at once.',
  exclusive: 'Opening one fold closes the others.'
};

export const FoldTypeDial: FC = () => {
  const {foldType, change} = useControls();
  return <DialRow label="fold type"
    name="fold-type"
    choices={foldTypes}
    chosen={foldType}
    onChosen={next => change({foldType: next})}
    reading={readings[foldType]}/>;
};

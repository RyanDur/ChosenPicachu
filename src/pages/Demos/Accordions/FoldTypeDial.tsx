import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {DialRow, Reading, useControls} from '../Controls';
import {FoldType} from '../ReaderSettings';

const foldTypes = [{words: 'Inclusive', value: 'inclusive'}, {words: 'Exclusive', value: 'exclusive'}] as const;

const readings: Record<FoldType, string> = {
  inclusive: 'Opening one fold leaves the others as they are.',
  exclusive: 'Opening one fold closes the others.'
};

export const FoldTypeDial: FC = () => {
  const {foldType, change} = useControls();
  return <DialRow label="fold type">
    <PillGlider label="fold type"
      name="fold-type"
      choices={foldTypes}
      chosen={foldType}
      onChosen={next => change({foldType: next})}/>
    <Reading>{readings[foldType]}</Reading>
  </DialRow>;
};

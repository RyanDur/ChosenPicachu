import {FC} from 'react';
import {useControls} from '../Controls';
import {Exhibit, ExhibitFoot} from '../Exhibit';
import {FoldType} from '../ReaderSettings';
import {Fold} from './accordion-props';
import {platformBuilds} from './platform-builds';

export const PlatformExhibit: FC<{folds: Record<FoldType, Fold[]>}> = ({folds}) => {
  const {foldType, foldMotion} = useControls();
  const {Accordion: Platform} = platformBuilds[foldType];
  return <Exhibit name={foldType === 'inclusive'
    ? 'Inclusive accordion using details elements'
    : 'Exclusive accordion using details elements'}>
    <Platform className={foldMotion} folds={folds[foldType]}/>
    <ExhibitFoot lead="No script:">details elements, with HTML and CSS alone.</ExhibitFoot>
  </Exhibit>;
};

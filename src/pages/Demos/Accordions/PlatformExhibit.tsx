import {FC} from 'react';
import {useControls} from '../Controls';
import {Exhibit, ExhibitFoot} from '../Exhibit';
import {FoldType} from '../ReaderSettings';
import {Fold} from './accordion-props';
import {platformBuilds} from './platform-builds';

const exhibitNames: Record<FoldType, string> = {
  inclusive: 'Inclusive accordion using details elements',
  exclusive: 'Exclusive accordion using details elements'
};

export const PlatformExhibit: FC<{folds: Record<FoldType, Fold[]>}> = ({folds}) => {
  const {foldType, foldMotion} = useControls();
  const {Accordion: Platform} = platformBuilds[foldType];
  return <Exhibit name={exhibitNames[foldType]}>
    <Platform className={foldMotion} folds={folds[foldType]}/>
    <ExhibitFoot><strong className="bold">No script:</strong> details elements, with HTML and CSS alone.</ExhibitFoot>
  </Exhibit>;
};

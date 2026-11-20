import {FC} from 'react';
import {classNames} from '@components';
import {useControls} from '../Controls';
import {FoldType} from '../ReaderSettings';
import {Fold} from './accordion-props';
import {looks} from './looks';
import {platformBuilds} from './platform-builds';

export const PlatformExhibit: FC<{folds: Record<FoldType, Fold[]>}> = ({folds}) => {
  const {foldType, foldMotion} = useControls();
  const {Accordion: Platform} = platformBuilds[foldType];
  return <Platform className={classNames(looks.exhibit, foldMotion)} folds={folds[foldType]}/>;
};

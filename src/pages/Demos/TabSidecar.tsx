import {FC, PropsWithChildren, useContext} from 'react';
import {classNames, PropsWithClassName} from '@components';
import {useControls} from './Controls';
import {PanelFolds} from './panel-folds';
import './TabSidecar.css';

type Props = PropsWithClassName<PropsWithChildren<{label?: string}>>;

export const TabSidecar: FC<Props> = ({label, className, children}) => {
  const folds = useContext(PanelFolds);
  const {parts} = useControls();
  const folded = folds && parts === 'hidden';
  return <aside aria-label={label} className={classNames('tab-sidecar field', folded && 'folded', className)}>
    {children}
  </aside>;
};

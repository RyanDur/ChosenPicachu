import {FC, PropsWithChildren, ReactNode, useContext} from 'react';
import {is} from '@ryandur/sand';
import {classNames, PropsWithClassName} from '@components';
import {useControls} from './Controls';
import {PanelFolds} from './panel-folds';
import './TabSidecar.css';

type Props = PropsWithClassName<PropsWithChildren<{label?: string; size?: ReactNode}>>;

const PartsFold: FC = () => {
  const {parts, change} = useControls();
  const shown = parts === 'shown';
  return <button type="button" tabIndex={0} className="parts-fold rounded-corners ringed unfilled caption reachable focus-ringed"
    aria-expanded={shown}
    onClick={() => change({parts: shown ? 'hidden' : 'shown'})}>{shown ? 'Hide parts' : 'Show parts'}</button>;
};

export const TabSidecar: FC<Props> = ({label, size, className, children}) => {
  const folds = useContext(PanelFolds);
  const {parts} = useControls();
  const folded = folds && parts === 'hidden';
  return <aside aria-label={label} className={classNames('tab-sidecar field', folded && 'folded', className)}>
    {(is(size) || folds) && <header className="sidecar-head">{size}{folds && <PartsFold/>}</header>}
    {children}
  </aside>;
};

import {FC, PropsWithChildren, useContext} from 'react';
import {useControls} from './Controls';
import {PanelFolds} from './panel-folds';
import './TabSidecar.css';

const PartsFold: FC = () => {
  const {parts, change} = useControls();
  const shown = parts === 'shown';
  return <button type="button" tabIndex={0} className="parts-fold rounded-corners ringed unfilled caption reachable focus-ringed"
    aria-expanded={shown}
    onClick={() => change({parts: shown ? 'hidden' : 'shown'})}>{shown ? 'Hide parts' : 'Show parts'}</button>;
};

export const SidecarHead: FC<PropsWithChildren> = ({children}) => {
  const folds = useContext(PanelFolds);
  return <header className="sidecar-head">{children}{folds && <PartsFold/>}</header>;
};

import {FC, PropsWithChildren, useContext} from 'react';
import {not} from '@ryandur/sand';
import {useHydrated} from '@components';
import {useControls} from './Controls';
import {PanelFolds} from './panel-folds';
import './TabSidecar.css';

const PartsFold: FC = () => {
  const {parts, change} = useControls();
  const shown = parts === 'shown';
  const hydrated = useHydrated();
  return <button type="button" tabIndex={0}
    className="parts-fold rounded-corners ringed unfilled caption reachable attentive smoked-while-disabled"
    disabled={not(hydrated)}
    aria-expanded={shown}
    onClick={() => change({parts: shown ? 'hidden' : 'shown'})}>{shown ? 'Hide parts' : 'Show parts'}</button>;
};

export const SidecarHead: FC<PropsWithChildren> = ({children}) => {
  const folds = useContext(PanelFolds);
  return <header className="sidecar-head">{children}{folds && <PartsFold/>}</header>;
};

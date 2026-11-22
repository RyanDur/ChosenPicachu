import {FC, PropsWithChildren, useContext} from 'react';
import {not} from '@ryandur/sand';
import {useHydrated} from '@components';
import {useControls} from './Controls';
import {BesideAPart} from './beside-a-part';
import {panelBesideAPart} from './panel-beside-a-part';
import './TabSidecar.css';

const PartsFold: FC = () => {
  const {parts, change} = useControls();
  const shown = parts === 'shown';
  const hydrated = useHydrated();
  // Safari's plain Tab skips a button with no tabindex written, as the Tables part on focus teaches.
  return <button type="button" tabIndex={0}
    className="parts-fold caption attentive field hairline-outline reachable smoked-while-disabled"
    disabled={not(hydrated)}
    aria-expanded={shown}
    aria-controls={panelBesideAPart}
    onClick={() => change({parts: shown ? 'hidden' : 'shown'})}>{shown ? 'Hide parts' : 'Show parts'}</button>;
};

export const SidecarHeader: FC<PropsWithChildren> = ({children}) => {
  const besideAPart = useContext(BesideAPart);
  return <header className="sidecar-header">{children}{besideAPart && <PartsFold/>}</header>;
};

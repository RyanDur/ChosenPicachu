import {FC, PropsWithChildren, useContext} from 'react';
import {classNames, PropsWithClassName} from '@components';
import {useControls} from './Controls';
import {BesideAPart} from './beside-a-part';
import {panelBesideAPart} from './panel-beside-a-part';
import './TabSidecar.css';

type Props = PropsWithClassName<PropsWithChildren<{label?: string}>>;

export const TabSidecar: FC<Props> = ({label, className, children}) => {
  const besideAPart = useContext(BesideAPart);
  const {parts} = useControls();
  const folded = besideAPart && parts === 'hidden';
  return <aside id={besideAPart ? panelBesideAPart : undefined} aria-label={label}
    className={classNames('tab-sidecar', folded && 'folded field', className)}>
    {children}
  </aside>;
};

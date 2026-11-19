import {FC, PropsWithChildren} from 'react';
import './TabSidecar.css';

export const TabSidecar: FC<PropsWithChildren<{label: string}>> = ({label, children}) =>
  <aside aria-label={label} className="tab-sidecar">{children}</aside>;

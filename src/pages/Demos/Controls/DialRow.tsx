import {FC, PropsWithChildren} from 'react';
import './DialRow.css';

export const DialRow: FC<PropsWithChildren<{label: string}>> = ({label, children}) =>
  <li className="dial-row veiled-rule-below">
    <span className="axis caption uppercase" aria-hidden>{label}</span>
    {children}
  </li>;

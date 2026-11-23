import {FC, PropsWithChildren} from 'react';
import './PartsIndex.css';

export const PartsIndex: FC<PropsWithChildren<{id: string}>> = ({id, children}) =>
  <section id={id} className="parts-index">{children}</section>;

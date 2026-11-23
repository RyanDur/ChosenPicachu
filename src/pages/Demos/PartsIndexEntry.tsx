import {FC, PropsWithChildren} from 'react';
import './PartsIndex.css';

export const PartsIndexEntry: FC<PropsWithChildren> = ({children}) =>
  <li className="parts-index-entry muted-rule-below">{children}</li>;

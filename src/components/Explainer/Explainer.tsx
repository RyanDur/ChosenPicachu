import {FC, PropsWithChildren} from 'react';
import './Explainer.css';

export const Explainer: FC<PropsWithChildren> = ({children}) =>
  <details className="explainer">
    <summary className="prompt caption reachable">what am I looking at?</summary>
    <p className="explanation caption">{children}</p>
  </details>;

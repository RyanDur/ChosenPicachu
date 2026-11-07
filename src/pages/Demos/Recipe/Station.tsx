import {FC, PropsWithChildren} from 'react';

import {stations} from './stations';

export const Station: FC<PropsWithChildren<{at: number}>> = ({at, children}) =>
  <li className="station void-badge-before shadow-rail-along" id={stations.idOf(at)} tabIndex={-1}>{children}</li>;

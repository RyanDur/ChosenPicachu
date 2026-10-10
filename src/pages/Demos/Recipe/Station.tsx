import {FC, PropsWithChildren} from 'react';

export const stationId = (station: number) => `station-${station}`;

export const Station: FC<PropsWithChildren<{at: number}>> = ({at, children}) =>
  <li className="station void-badge-before shadow-rail-along" id={stationId(at)} tabIndex={-1}>{children}</li>;

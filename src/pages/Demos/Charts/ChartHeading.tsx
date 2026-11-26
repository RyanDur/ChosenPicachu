import {FC, PropsWithChildren, useContext} from 'react';
import {ExhibitRank} from '../Exhibit';

export const ChartHeading: FC<PropsWithChildren<{id: string}>> = ({id, children}) =>
  useContext(ExhibitRank) === 3
    ? <h4 id={id} className="off-screen">{children}</h4>
    : <h3 id={id} className="off-screen">{children}</h3>;

import {FC, PropsWithChildren} from 'react';

export const ExhibitFoot: FC<PropsWithChildren<{lead: string}>> = ({lead, children}) =>
  <p className="paragraph"><strong className="bold">{lead}</strong> {children}</p>;

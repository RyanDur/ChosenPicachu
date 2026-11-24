import {FC, PropsWithChildren, useContext, useId} from 'react';
import {ExhibitRank} from './ExhibitRank';
import './Exhibit.css';

export const Framed: FC<PropsWithChildren<{kind: string; name: string}>> = ({kind, name, children}) => {
  const headingId = `exhibit${useId()}`;
  const rank = useContext(ExhibitRank);
  return <section aria-labelledby={headingId} className="exhibit card rounded-corners lifted">
    <hgroup className="veiled-rule-below">
      <p className="caption uppercase">{kind}</p>
      {rank === 3
        ? <h3 id={headingId} className="sub-title bold">{name}</h3>
        : <h2 id={headingId} className="sub-title bold">{name}</h2>}
    </hgroup>
    {children}
  </section>;
};

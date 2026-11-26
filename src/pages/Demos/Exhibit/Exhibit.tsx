import {FC, PropsWithChildren, useContext, useId} from 'react';
import {ExhibitRank} from './ExhibitRank';
import './Exhibit.css';

type ExhibitKind = 'Exhibit' | 'Sketch';

export const Exhibit: FC<PropsWithChildren<{kind?: ExhibitKind; name: string}>> = ({
  kind = 'Exhibit',
  name,
  children
}) => {
  const headingId = `exhibit${useId()}`;
  const rank = useContext(ExhibitRank);
  return <section aria-labelledby={headingId} className="exhibit card rounded-corners lifted">
    <hgroup className="veiled-rule-below">
      <p className="caption uppercase" aria-hidden="true">{kind}</p>
      {rank === 3
        ? <h3 id={headingId} className="sub-title bold">{name}</h3>
        : <h2 id={headingId} className="sub-title bold">{name}</h2>}
    </hgroup>
    {children}
  </section>;
};

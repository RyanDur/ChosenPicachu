import {FC, PropsWithChildren, useContext, useId} from 'react';
import {ExhibitRank} from './ExhibitRank';
import './Exhibit.css';

export const Exhibit: FC<PropsWithChildren<{name: string}>> = ({name, children}) => {
  const named = `exhibit${useId()}`;
  const rank = useContext(ExhibitRank);
  return <section aria-labelledby={named} className="exhibit card rounded-corners lifted">
    <hgroup className="veiled-rule-below">
      <p className="caption uppercase">Exhibit</p>
      {rank === 3
        ? <h3 id={named} className="sub-title bold">{name}</h3>
        : <h2 id={named} className="sub-title bold">{name}</h2>}
    </hgroup>
    {children}
  </section>;
};

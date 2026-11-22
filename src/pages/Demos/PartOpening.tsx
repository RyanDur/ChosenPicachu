import {FC, PropsWithChildren, useContext} from 'react';
import {PartHeading} from './part-heading';

export const PartOpening: FC<PropsWithChildren<{readonly place: string}>> = ({place, children}) => {
  const {id, heading} = useContext(PartHeading);
  return <header className="part-opening">
    <hgroup>
      <p className="caption uppercase">{place}</p>
      <h2 id={id} className="title">{heading}</h2>
    </hgroup>
    {children}
  </header>;
};

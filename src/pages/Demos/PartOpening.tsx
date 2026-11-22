import {FC, PropsWithChildren} from 'react';
import {useThePart} from './useThePart';

export const PartOpening: FC<PropsWithChildren> = ({children}) => {
  const {headingId, heading, place} = useThePart();
  return <header className="part-opening">
    <hgroup>
      <p className="caption uppercase">{place}</p>
      <h2 id={headingId} className="title">{heading}</h2>
    </hgroup>
    {children}
  </header>;
};

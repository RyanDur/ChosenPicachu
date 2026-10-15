import {FC, PropsWithChildren, useContext} from 'react';
import {doorId} from './door';
import {CurrentDoor} from './DoorSection';

export const HowIOrganizeIt: FC<PropsWithChildren> = ({children}) => {
  const door = useContext(CurrentDoor);
  return <section className="door-practice" aria-labelledby={`${doorId(door)} ${doorId(door)}-practice`}>
    <h3 className="sub-title" id={`${doorId(door)}-practice`}>how I organize it</h3>
    {children}
  </section>;
};

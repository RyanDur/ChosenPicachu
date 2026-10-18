import {FC, PropsWithChildren, useContext} from 'react';
import {doorId} from '@pages/Record/moments/doors';
import {CurrentDoor} from './DoorSection';

export const HowIOrganizeIt: FC<PropsWithChildren> = ({children}) =>
  useContext(CurrentDoor).either(door => <section className="door-practice" aria-labelledby={`${doorId(door)} ${doorId(door)}-practice`}>
    <h3 className="sub-title" id={`${doorId(door)}-practice`}>how I organize it</h3>
    {children}
  </section>, () => null);

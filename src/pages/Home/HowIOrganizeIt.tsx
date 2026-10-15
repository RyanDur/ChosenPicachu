import {FC, PropsWithChildren} from 'react';
import {Door, doorId} from './door';

export const HowIOrganizeIt: FC<PropsWithChildren<{door: Door}>> = ({door, children}) =>
  <section className="door-practice" aria-labelledby={`${doorId(door)} ${doorId(door)}-practice`}>
    <h3 className="sub-title" id={`${doorId(door)}-practice`}>how I organize it</h3>
    {children}
  </section>;

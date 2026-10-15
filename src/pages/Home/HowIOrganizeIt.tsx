import {FC, PropsWithChildren} from 'react';

export const HowIOrganizeIt: FC<PropsWithChildren<{door: string}>> = ({door, children}) =>
  <section className="door-practice" aria-labelledby={`${door} ${door}-practice`}>
    <h3 className="sub-title" id={`${door}-practice`}>how I organize it</h3>
    {children}
  </section>;

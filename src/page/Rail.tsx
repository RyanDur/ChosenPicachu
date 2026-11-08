import {FC} from 'react';
import {Feedback} from '@feedback';
import {SideNav} from './SideNav';

export const Rail: FC<{pageUnknown?: boolean}> = ({pageUnknown}) =>
  <section className="rail backdrop backdrop-below" aria-label="pages and feedback">
    <SideNav pageUnknown={pageUnknown}/>
    <Feedback/>
  </section>;

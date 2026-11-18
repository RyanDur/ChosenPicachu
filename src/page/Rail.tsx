import {FC} from 'react';
import {Feedback} from '@feedback';
import {SideNav} from './SideNav';

export const Rail: FC = () =>
  <section className="rail backdrop backdrop-below" aria-label="pages and feedback">
    <SideNav/>
    <Feedback/>
    <button type="button" className="menu-button path rail-path bold attentive field reachable" popoverTarget="side-nav"
      aria-label="Site menu">Menu</button>
  </section>;

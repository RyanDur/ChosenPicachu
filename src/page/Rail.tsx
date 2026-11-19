import {FC} from 'react';
import {Feedback} from '@feedback';
import {SideNav} from './SideNav';
import {siteMenu} from './siteMenu';

export const Rail: FC = () =>
  <section className="rail backdrop backdrop-below" aria-label="pages and feedback">
    <SideNav/>
    <Feedback/>
    <button type="button" className="menu-button path rail-path bold attentive field borderless reachable" popoverTarget={siteMenu.id}>Menu</button>
  </section>;

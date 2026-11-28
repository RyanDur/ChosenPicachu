import {FC} from 'react';
import {DemoTopics} from '@pages/Demos';
import {TabLink} from '@pages/Demos/TabLink';
import {tabHeadings} from './tab-headings';

export const RemembersTheFoldIntroduction: FC = () =>
  <p className="paragraph">A fold has to keep whether it is open somewhere. This part keeps it in a hidden input and
    lets a rule in the style sheet read it, with no script. It builds on “<TabLink to={DemoTopics.accordions}
    heading={tabHeadings.exhibitSource}>The exhibit’s source</TabLink>” on the accordions tab, for elements, tags,
    screen readers, dials, style sheets, rules, selectors and properties.</p>;

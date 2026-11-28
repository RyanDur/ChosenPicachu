import {FC} from 'react';
import {DemoTopics} from '@pages/Demos';
import {TabLink} from '@pages/Demos/TabLink';
import {HeadingLink} from './HeadingLink';
import {tabHeadings} from './tab-headings';

export const RemembersTheFoldIntroduction: FC = () =>
  <p className="paragraph">A fold has to keep whether it is open somewhere. This part keeps it in a hidden input and
    lets a rule in the style sheet read it, with no script. It builds on two places on the accordions tab:
    “<HeadingLink heading="html-alone-heading"/>”, for elements, tags and screen readers,
    and “<TabLink to={DemoTopics.accordions} heading={tabHeadings.exhibitSource}>The exhibit’s source</TabLink>”
    under it, for style sheets, rules, selectors and properties.</p>;

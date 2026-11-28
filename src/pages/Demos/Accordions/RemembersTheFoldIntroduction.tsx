import {FC} from 'react';
import {HeadingLink} from './HeadingLink';

export const RemembersTheFoldIntroduction: FC = () =>
  <p className="paragraph">A fold has to keep whether it is open somewhere. This part keeps it in a hidden input and
    lets a rule in the style sheet read it, with no script. It builds on “<HeadingLink heading="html-alone-heading"/>”
    on the accordions tab, for elements, tags, screen readers, style sheets, rules, selectors and properties.</p>;

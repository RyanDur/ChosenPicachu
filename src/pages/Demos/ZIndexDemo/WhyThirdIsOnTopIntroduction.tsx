import {accordionParts} from '@pages/Demos/Accordions/part-pages';
import {TabLink} from '@pages/Demos/TabLink';
import {DemoTopics} from '@pages/Demos';
import {DemoLink} from '@pages/Demos/DemoLink';
import {FC} from 'react';

const remembersTheFoldAt = accordionParts.addressOf('a-box-remembers-the-fold');

export const WhyThirdIsOnTopIntroduction: FC = () =>
  <p className="paragraph">Even with no z-index anywhere, one of three overlapping cards ends up on top. This part
    shows why, and then what one z-index does to it. It assumes what
    the <TabLink to={DemoTopics.accordions}>accordions tab</TabLink> gives: an element
    and <DemoLink to={remembersTheFoldAt}>a class</DemoLink>.</p>;

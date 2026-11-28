import {TabLink} from '@pages/Demos/TabLink';
import {DemoTopics} from '@pages/Demos';
import {FC} from 'react';
import {PartLink} from './PartLink';

export const LetsBuildThisFeatureIntroduction: FC = () =>
  <p className="paragraph">We are going to build this site’s banner: the panel that carries the news, whatever the
    news is. Elsewhere on this site it reports real trouble. On this page,
    the <TabLink to={DemoTopics.accordions}>dials</TabLink> are controls that set how the banner behaves, and the Raise
    a banner button under them raises random nonsense so you can watch the mechanics. This part assumes
    what <PartLink part="why-third-is-on-top"/> through <PartLink part="why-the-popover-wins"/> give: what a
    z-index does and where it stops counting, a popover in the top layer, and, for the site’s menu, a component, its
    state and an event.</p>;

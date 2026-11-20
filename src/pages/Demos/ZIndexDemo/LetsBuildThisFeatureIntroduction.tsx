import {TabLink} from '@pages/Demos/TabLink';
import {DemoTopics} from '@pages/Demos';
import {FC} from 'react';
import {PartLink} from './PartLink';

export const LetsBuildThisFeatureIntroduction: FC = () =>
  <p className="overview paragraph">
    We are going to build this site’s banner: the panel that carries the news, whatever the news is. Elsewhere on
    this site it reports real trouble. On this page, the <TabLink to={DemoTopics.accordions}>dials</TabLink> are
    controls that set how the banner behaves, and the Raise a banner button under them raises random nonsense
    so you can watch the mechanics. This part assumes what <PartLink part="why-third-is-on-top"/> through <PartLink
      part="why-a-fixed-banner-still-loses"/> give: what a z-index does and where it stops counting, and the component,
    state and event that <PartLink part="why-the-popover-wins"/> explains. The banner sets a z-index, and where it sits
    decides what that number is compared with.
  </p>;

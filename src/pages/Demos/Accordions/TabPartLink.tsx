import {FC} from 'react';
import {DemoTopics} from '@pages/Demos';
import {TabLink} from '@pages/Demos/TabLink';
import {accordionParts, TabHeading} from './part-pages';

export const TabPartLink: FC<{heading: TabHeading}> = ({heading}) =>
  <TabLink to={DemoTopics.accordions} heading={heading}>{accordionParts.titleOf(heading)}</TabLink>;

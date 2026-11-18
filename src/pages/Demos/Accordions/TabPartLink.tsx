import {FC} from 'react';
import {DemoLink} from '@pages/Demos/DemoLink';
import {accordionParts, TabHeading} from './part-pages';

export const TabPartLink: FC<{heading: TabHeading}> = ({heading}) => {
  const {to, heading: fragment} = accordionParts.whereIs(heading);
  return <DemoLink to={to} heading={fragment}>{accordionParts.titleOf(heading)}</DemoLink>;
};

import {FC} from 'react';
import {DemoLink} from '@pages/Demos/DemoLink';
import {accordionParts, BookPart} from './part-pages';

export const HeadingLink: FC<{heading: BookPart}> = ({heading}) => {
  const {to, heading: fragment} = accordionParts.whereIs(heading);
  return <DemoLink to={to} heading={fragment}>{accordionParts.titleOf(heading)}</DemoLink>;
};

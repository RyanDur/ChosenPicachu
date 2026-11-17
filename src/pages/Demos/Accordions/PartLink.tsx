import {FC} from 'react';
import {DemoLink} from '@pages/Demos/DemoLink';
import {AccordionPart, accordionParts} from './part-pages';

export const PartLink: FC<{part: AccordionPart}> = ({part}) =>
  <DemoLink to={accordionParts.addressOf(part)}>{accordionParts.told(part).name}</DemoLink>;

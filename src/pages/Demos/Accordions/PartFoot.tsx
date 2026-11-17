import {FC} from 'react';
import {demoTab, DemoTopics} from '@pages/Demos';
import {PageFoot} from '@pages/Demos/PageFoot';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {AccordionPart, accordionParts, TabHeading} from './part-pages';

export const PartFoot: FC<{part: AccordionPart}> = ({part}) => {
  const carried = useCarriedAddress();
  const neighbor = (heading: TabHeading) => ({
    title: accordionParts.numbered(heading),
    address: accordionParts.pageOf(heading)
      .map(page => carried(accordionParts.addressOf(page)))
      .orElse(carried(demoTab.address(DemoTopics.accordions), heading))
  });
  return <PageFoot label="the accordions parts"
    previous={accordionParts.previousOf(part).map(neighbor)}
    next={accordionParts.nextOf(part).map(neighbor)}/>;
};

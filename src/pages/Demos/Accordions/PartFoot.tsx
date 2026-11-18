import {FC} from 'react';
import {PageFoot} from '@pages/Demos/PageFoot';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {AccordionPart, accordionParts, BookPart} from './part-pages';

export const PartFoot: FC<{part: AccordionPart}> = ({part}) => {
  const carried = useCarriedAddress();
  const neighbor = (heading: BookPart) => {
    const {to, heading: fragment} = accordionParts.whereIs(heading);
    return {title: accordionParts.numbered(heading), address: carried(to, fragment)};
  };
  return <PageFoot label="the accordions parts"
    previous={accordionParts.previousOf(part).map(neighbor)}
    next={accordionParts.nextOf(part).map(neighbor)}/>;
};

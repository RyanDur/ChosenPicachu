import {FC} from 'react';
import {ReadingTime} from '@pages/Demos/ReadingTime';
import {AccordionPart, accordionParts} from './part-pages';
import {PartLink} from './PartLink';
import './PartListing.css';

export const PartListing: FC<{part: AccordionPart}> = ({part}) => {
  const {heading, says, minutes} = accordionParts.told(part);
  return <section className="part-listing" aria-labelledby={heading}>
    <h3 id={heading} className="sub-title bold"><PartLink part={part}/></h3>
    <p className="paragraph">{says}</p>
    <ReadingTime minutes={minutes}/>
  </section>;
};

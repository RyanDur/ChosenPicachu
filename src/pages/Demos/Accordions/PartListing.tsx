import {FC} from 'react';
import {ReadingTime} from '@pages/Demos/ReadingTime';
import {AccordionPart, accordionParts} from './part-pages';
import {PartLink} from './PartLink';
import './PartListing.css';

type Props = {
  part: AccordionPart;
  level: 2 | 3;
};

export const PartListing: FC<Props> = ({part, level}) => {
  const {heading, says, minutes} = accordionParts.told(part);
  const Title = level === 2 ? 'h2' : 'h3';
  return <section className="part-listing" aria-labelledby={heading}>
    <Title id={heading} className={level === 2 ? 'title bold' : 'sub-title bold'}><PartLink part={part}/></Title>
    <p className="paragraph">{says}</p>
    <ReadingTime minutes={minutes}/>
  </section>;
};

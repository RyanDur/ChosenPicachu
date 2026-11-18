import {FC} from 'react';
import {ReadingTime} from '@pages/Demos/ReadingTime';
import {AccordionPart, accordionParts} from './part-pages';
import {PartLink} from './PartLink';
import './PartListing.css';

type Props = {
  part: AccordionPart;
  level: 2 | 3;
};

const headings = {
  2: {Heading: 'h2', look: 'title bold'},
  3: {Heading: 'h3', look: 'sub-title bold'}
} as const;

export const PartListing: FC<Props> = ({part, level}) => {
  const {heading, says, minutes} = accordionParts.told(part);
  const {Heading, look} = headings[level];
  return <section className="part-listing" aria-labelledby={heading}>
    <Heading id={heading} className={look}><PartLink part={part}/></Heading>
    <p className="paragraph">{says}</p>
    <ReadingTime minutes={minutes}/>
  </section>;
};

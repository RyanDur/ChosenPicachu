import {FC} from 'react';
import {DemoLink} from '@pages/Demos/DemoLink';
import {ReadingTime} from '@pages/Demos/ReadingTime';
import {ZIndexPart, zIndexParts} from './part-pages';
import './ZIndexDemo.css';

export const PartListing: FC<{part: ZIndexPart}> = ({part}) => {
  const {heading, name, says, minutes} = zIndexParts.told(part);
  return <section aria-labelledby={heading} className="stacking-part">
    <h2 id={heading} className="title bold"><DemoLink to={zIndexParts.addressOf(part)}>{name}</DemoLink></h2>
    <p className="paragraph">{says}</p>
    <ReadingTime minutes={minutes}/>
  </section>;
};

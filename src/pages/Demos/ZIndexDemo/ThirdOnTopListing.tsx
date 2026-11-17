import {FC} from 'react';
import {DemoLink} from '@pages/Demos/DemoLink';
import {partHeadings} from './part-headings';
import {zIndexParts} from './part-pages';

const thirdOnTop = 'why-third-is-on-top';
const told = zIndexParts.told(thirdOnTop);

export const ThirdOnTopListing: FC = () =>
  <section aria-labelledby={partHeadings.thirdOnTop} className="stacking-part">
    <h2 id={partHeadings.thirdOnTop} className="title bold">
      <DemoLink to={zIndexParts.addressOf(thirdOnTop)}>{told.name}</DemoLink>
    </h2>
    <p className="paragraph">{told.says}</p>
    <p className="caption muted-ink">
      <time dateTime={`PT${told.minutes}M`}>{`${told.minutes} minutes to read`}</time>
    </p>
  </section>;

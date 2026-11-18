import {FC} from 'react';
import {accordionParts} from './part-pages';

export const AccordionsSize: FC = () =>
  <p className="paragraph">
    {`Six parts, about ${accordionParts.minutes} minutes. The dials you set on one part carry to the next.`}
  </p>;

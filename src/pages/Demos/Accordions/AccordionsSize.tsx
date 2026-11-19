import {FC} from 'react';
import {accordionParts} from './part-pages';

export const AccordionsSize: FC = () =>
  <p className="paragraph">
    {`Six parts, about ${accordionParts.minutes} minutes. What you choose under the list carries to every part’s page.`}
  </p>;

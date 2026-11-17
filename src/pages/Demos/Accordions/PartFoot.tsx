import {FC} from 'react';
import {DemoTopics} from '@pages/Demos';
import {TabLink} from '@pages/Demos/TabLink';
import {AccordionPart, accordionParts} from './part-pages';

export const PartFoot: FC<{part: AccordionPart}> = ({part}) =>
  <nav className="part-neighbors" aria-label="the accordions parts">
    {accordionParts.previousOf(part).map(heading =>
      <TabLink key={heading} to={DemoTopics.accordions} heading={heading} rel="prev" className="reachable">
        {`Previous: ${accordionParts.numbered(heading)}`}
      </TabLink>).orNull()}
    {accordionParts.nextOf(part).map(heading =>
      <TabLink key={heading} to={DemoTopics.accordions} heading={heading} rel="next" className="onward reachable">
        {`Next: ${accordionParts.numbered(heading)}`}
      </TabLink>).orNull()}
  </nav>;

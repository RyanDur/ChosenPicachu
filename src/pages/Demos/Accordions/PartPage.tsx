import {FC, PropsWithChildren, useId} from 'react';
import {demoTab, DemoTopics} from '@pages/Demos';
import {AccordionPart, accordionParts} from './part-pages';
import './PartPage.css';

type Props = {
  part: AccordionPart;
};

export const PartPage: FC<PropsWithChildren<Props>> = ({part, children}) => {
  const titled = `part${useId()}`;
  const {name, ordinal} = accordionParts.told(part);
  return <section aria-labelledby={titled} className="part-page">
    <hgroup>
      <p className="caption">{`${demoTab.names[DemoTopics.accordions]} · part ${ordinal} of ${accordionParts.inTheBook}`}</p>
      <h2 id={titled} className="title">{name}</h2>
    </hgroup>
    {children}
  </section>;
};

import {FC, PropsWithChildren, ReactNode, useId} from 'react';
import {demoTab, DemoTopics} from '@pages/Demos';
import {AccordionPart, accordionParts} from './part-pages';
import {PartFoot} from './PartFoot';
import '../PartPage.css';

type Props = {
  part: AccordionPart;
  introduction: ReactNode;
  panel: ReactNode;
};

export const PartPage: FC<PropsWithChildren<Props>> = ({part, introduction, panel, children}) => {
  const titled = `part${useId()}`;
  const {name, ordinal} = accordionParts.told(part);
  return <>
    <header className="part-opening">
      <hgroup>
        <p className="caption">{`${demoTab.names[DemoTopics.accordions]} · part ${ordinal} of ${accordionParts.inTheBook}`}</p>
        <h2 id={titled} className="title">{name}</h2>
      </hgroup>
      {introduction}
    </header>
    {panel}
    <section aria-labelledby={titled} className="part-page">
      {children}
      <PartFoot part={part}/>
    </section>
  </>;
};

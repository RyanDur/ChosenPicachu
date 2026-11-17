import {FC, useId} from 'react';
import {demoTab, DemoTopics} from '@pages/Demos';
import {FoldType} from '../Controls';
import {Fold} from './accordion-props';
import {AccordionPart, accordionParts} from './part-pages';
import {MeasuredHeight} from './MeasuredHeight';
import './PartPage.css';

type Props = {
  part: AccordionPart;
  folds: Record<FoldType, Fold[]>;
};

export const PartPage: FC<Props> = ({part, folds}) => {
  const titled = `part${useId()}`;
  const {name, ordinal} = accordionParts.told(part);
  return <section aria-labelledby={titled} className="part-page">
    <hgroup>
      <p className="caption">{`${demoTab.names[DemoTopics.accordions]} · part ${ordinal} of ${accordionParts.inTheBook}`}</p>
      <h2 id={titled} className="title">{name}</h2>
    </hgroup>
    <MeasuredHeight folds={folds}/>
  </section>;
};

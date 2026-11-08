import {FC} from 'react';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import './Accordions.css';

export const InclusiveToggleAccordion: FC<AccordionProps> = ({
  className,
  content,
  motion
}) => <article className={classNames('inclusive-toggle-accordion', motion, className)}>
  <header>
    <h3 className="sub-title bold">Inclusive accordion using details elements</h3>
  </header>
  <ul className="new-accordion">
    {content.map(({value, key}) =>
      <li key={key}>
        <details className="fold">
          <summary className="info-label opening-arrow inverse-filled attentive field-outlined corner-after">{key}</summary>
          <p className="info"><span className="fold-text">{value}</span></p>
        </details>
      </li>)}
  </ul>
</article>;

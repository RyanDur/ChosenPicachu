import {FC} from 'react';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import './Accordions.css';

export const InclusiveToggleAccordion: FC<AccordionProps> = ({
  className,
  folds
}) => <article className={classNames('inclusive-toggle-accordion', className)}>
  <header>
    <h3 className="sub-title bold">Inclusive accordion using details elements</h3>
  </header>
  <ul className="new-accordion">
    {folds.map(({title, text}) =>
      <li key={title}>
        <details className="fold">
          <summary className="info-label opening-arrow inverse-filled attentive field-outlined corner-after">{title}</summary>
          <p className="info"><span className="fold-text">{text}</span></p>
        </details>
      </li>)}
  </ul>
</article>;

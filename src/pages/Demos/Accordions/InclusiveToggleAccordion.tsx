import {FC} from 'react';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import './Accordions.css';

export const InclusiveToggleAccordion: FC<AccordionProps> = ({
  className,
  folds
}) => <article className={classNames('inclusive-toggle-accordion', className)}>
  <ul className="new-accordion">
    {folds.map(({heading, story}) =>
      <li key={heading}>
        <details className="fold">
          <summary className="info-label opening-arrow inverse-filled attentive field-outlined corner-after">{heading}</summary>
          <p className="info"><span className="fold-text">{story}</span></p>
        </details>
      </li>)}
  </ul>
</article>;

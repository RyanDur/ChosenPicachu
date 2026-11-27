import {FC} from 'react';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import './Accordions.css';

export const ExclusiveToggleAccordion: FC<AccordionProps> = ({
  className,
  folds
}) => <section className={classNames('exclusive-toggle-accordion', className)}>
  <ul className="new-accordion">
    {folds.map(({heading, story}) =>
      <li key={heading}>
        <details className="fold" name="exclusive-toggle-accordion">
          <summary className="info-label opening-arrow inverse-filled attentive field-outlined corner-after">{heading}</summary>
          <p className="info"><span className="fold-text">{story}</span></p>
        </details>
      </li>)}
  </ul>
</section>;

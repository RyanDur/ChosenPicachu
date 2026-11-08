import {FC} from 'react';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import './Accordions.css';

export const ExclusiveToggleAccordion: FC<AccordionProps> = ({
  className,
  content,
  motion
}) => <article className={classNames('exclusive-toggle-accordion', motion, className)}>
  <header>
    <h3 className="sub-title bold">Exclusive accordion using details elements</h3>
  </header>
  <ul className="new-accordion">
    {content.map(({value, key}) =>
      <li key={key}>
        <details className="fold" name="exclusive-toggle-accordion">
          <summary className="info-label opening-arrow inverse-filled attentive field-outlined corner-after">{key}</summary>
          <p className="info">{value}</p>
        </details>
      </li>)}
  </ul>
</article>;

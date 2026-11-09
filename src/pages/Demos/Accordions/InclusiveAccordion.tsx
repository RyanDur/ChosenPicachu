import {FC} from 'react';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import './Accordions.css';
import './OldWayMotion.css';

export const InclusiveAccordion: FC<AccordionProps> = ({
  className,
  folds
}) => <article className={classNames('inclusive-accordion', className)}>
  <hgroup>
    <h3 className="sub-title bold">Accordion using checkboxes and a known height</h3>
    <p>No script: HTML and CSS alone.</p>
  </hgroup>
  <fieldset>
    <legend className="off-screen">folds</legend>
    <ul className="accordion trim">
      {folds.map(({title, text}, id) =>
        <li key={title} className="fold">
          <input id={`fold-${id}-checkbox`} className="info-toggle off-screen" type="checkbox"/>
          <label id={`fold-${id}-checkbox-label`} className="info-label opening-arrow inverse-filled prior-approached corner-after" htmlFor={`fold-${id}-checkbox`}>{title}</label>
          <div className="info">
            <section className="info-text foot-shadowed focus-ringed" tabIndex={0} aria-labelledby={`fold-${id}-checkbox-label`}>
              <p className="info-paragraph">{text}</p>
            </section>
          </div>
        </li>)}
    </ul>
  </fieldset>
</article>;

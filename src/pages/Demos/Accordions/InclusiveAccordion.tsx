import {FC} from 'react';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import './Accordions.css';
import './OldWayMotion.css';

export const InclusiveAccordion: FC<AccordionProps> = ({
  className,
  folds
}) => <section className={classNames('inclusive-accordion', className)}>
  <fieldset>
    <legend className="off-screen">folds</legend>
    <ul className="accordion">
      {folds.map(({heading, story}, id) =>
        <li key={heading} className="fold">
          <input id={`fold-${id}-checkbox`} className="info-toggle off-screen" type="checkbox"/>
          <label id={`fold-${id}-checkbox-label`}
            className="info-label opening-arrow drawn-piece prior-approached corner-after"
            htmlFor={`fold-${id}-checkbox`}>{heading}</label>
          <div className="info">
            <section className="info-text foot-shadowed focus-ringed" tabIndex={0}
              aria-labelledby={`fold-${id}-checkbox-label`}>
              <p className="info-paragraph">{story}</p>
            </section>
          </div>
        </li>)}
    </ul>
  </fieldset>
</section>;

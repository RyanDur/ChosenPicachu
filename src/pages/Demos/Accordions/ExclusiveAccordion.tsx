import {FC} from 'react';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import './Accordions.css';
import './OldWayMotion.css';

export const ExclusiveAccordion: FC<AccordionProps> = ({
  className,
  folds
}) => <section className={classNames('exclusive-accordion', className)}>
  <fieldset>
    <legend className="off-screen">folds</legend>
    <ul className="accordion">
      <li className="fold close drawn-piece">
        <input id="close-radio" defaultChecked={true} className="info-toggle off-screen" type="radio" name="group"/>
        <label className="info-label prior-approached" htmlFor="close-radio">Close</label>
      </li>
      {folds.map(({heading, story}, id) =>
        <li className="fold" key={heading}>
          <input id={`fold-${id}-radio`} className="info-toggle off-screen" type="radio" name="group"/>
          <label id={`fold-${id}-radio-label`}
            className="info-label opening-arrow drawn-piece prior-approached corner-after"
            htmlFor={`fold-${id}-radio`}>{heading}</label>
          <div className="info">
            <section className="info-text foot-shadowed focus-ringed" tabIndex={0}
              aria-labelledby={`fold-${id}-radio-label`}>
              <p className="info-paragraph">{story}</p>
            </section>
          </div>
        </li>)}
    </ul>
  </fieldset>
</section>;

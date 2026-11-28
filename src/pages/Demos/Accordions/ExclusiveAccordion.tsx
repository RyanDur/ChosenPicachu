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
      <li className="fold close">
        <input id="close-radio" defaultChecked={true} className="info-toggle off-screen" type="radio" name="group"/>
        <label className="info-label inverse-filled field-outlined attentive prior-approached reachable"
          htmlFor="close-radio">Close</label>
      </li>
      {folds.map(({heading, story}, id) =>
        <li className="fold" key={heading}>
          <input id={`fold-${id}-radio`} className="info-toggle off-screen" type="radio" name="group"/>
          <label id={`fold-${id}-radio-label`}
            className="info-label opening-arrow inverse-filled field-outlined attentive prior-approached corner-after"
            htmlFor={`fold-${id}-radio`}>{heading}</label>
          <div className="info">
            <section className="info-text focus-ringed" tabIndex={0}
              aria-labelledby={`fold-${id}-radio-label`}>
              <p className="info-paragraph">{story}</p>
            </section>
          </div>
        </li>)}
    </ul>
  </fieldset>
</section>;

import {FC} from 'react';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import './Accordions.css';
import './OldWayMotion.css';

export const ExclusiveAccordion: FC<AccordionProps> = ({
  className,
  folds,
  motion
}) => <article className={classNames('exclusive-accordion', motion, className)}>
  <hgroup>
    <h3 className="sub-title bold">Accordion using a radio group and a known height</h3>
    <p>No script: HTML and CSS alone.</p>
  </hgroup>
  <fieldset>
    <legend className="off-screen">folds</legend>
    <ul className="accordion trim">
      <li className="fold close field-inverse">
        <input id="close-radio" defaultChecked={true} className="info-toggle off-screen" type="radio" name="group"/>
        <label className="info-label field-ink prior-approached" htmlFor="close-radio">Close</label>
      </li>
      {folds.map(({title, text}, id) =>
        <li className="fold" key={title}>
          <input id={`fold-${id}-radio`} className="info-toggle off-screen" type="radio" name="group"/>
          <label id={`fold-${id}-radio-label`} className="info-label opening-arrow inverse-filled prior-approached corner-after" htmlFor={`fold-${id}-radio`}>{title}</label>
          <div className="info">
            <section className="info-text foot-shadowed focus-ringed" tabIndex={0} aria-labelledby={`fold-${id}-radio-label`}>
              <p className="info-paragraph">{text}</p>
            </section>
          </div>
        </li>)}
    </ul>
  </fieldset>
</article>;

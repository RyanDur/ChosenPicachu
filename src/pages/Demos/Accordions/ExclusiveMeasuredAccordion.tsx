import {FC, useState} from 'react';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import {MeasuredPanel} from './MeasuredPanel';
import './Accordions.css';

export const ExclusiveMeasuredAccordion: FC<AccordionProps> = ({
  className,
  content,
  motion
}) => {
  const [open, setOpen] = useState<string>();
  return <article className={classNames('exclusive-accordion', motion, className)}>
    <hgroup>
      <h3 className="sub-title bold">Accordion using a radio group and a measured height</h3>
      <p>A few lines of script measure each fold’s height.</p>
    </hgroup>
    <fieldset>
      <legend className="off-screen">folds</legend>
      <ul className="accordion trim">
        <li className="fold close field-inverse" onChange={() => setOpen(undefined)}>
          <input id="measured-close-radio" defaultChecked={true} className="info-toggle off-screen" type="radio" name="measured-group"/>
          <label className="info-label field-ink prior-approached" htmlFor="measured-close-radio">Close</label>
        </li>
        {content.map(({value, key}, id) =>
          <li className="fold" key={key} onChange={() => setOpen(key)}>
            <input id={`measured-fold-${id}-radio`} className="info-toggle off-screen" type="radio" name="measured-group"/>
            <label id={`measured-fold-${id}-radio-label`} className="info-label opening-arrow inverse-filled prior-approached corner-after" htmlFor={`measured-fold-${id}-radio`}>{key}</label>
            <MeasuredPanel open={open === key} namedBy={`measured-fold-${id}-radio-label`}>
              <p className="info-paragraph">{value}</p>
            </MeasuredPanel>
          </li>)}
      </ul>
    </fieldset>
  </article>;
};

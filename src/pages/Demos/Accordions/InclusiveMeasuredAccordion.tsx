import {ChangeEvent, FC, useState} from 'react';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import {MeasuredPanel} from './MeasuredPanel';
import './Accordions.css';
import './OldWayMotion.css';

const toggledTo = ({target}: ChangeEvent<HTMLLIElement>): boolean =>
  target instanceof HTMLInputElement && target.checked;

const withPart = (open: readonly string[], title: string, opened: boolean): readonly string[] =>
  opened ? [...open, title] : open.filter(part => part !== title);

export const InclusiveMeasuredAccordion: FC<AccordionProps> = ({
  className,
  folds,
  motion
}) => {
  const [open, setOpen] = useState<readonly string[]>([]);
  return <article className={classNames('inclusive-accordion', motion, className)}>
    <hgroup>
      <h3 className="sub-title bold">Accordion using checkboxes and a measured height</h3>
      <p>A few lines of script measure each fold’s height.</p>
    </hgroup>
    <fieldset>
      <legend className="off-screen">folds</legend>
      <ul className="accordion trim">
        {folds.map(({title, text}, id) =>
          <li key={title} className="fold"
            onChange={event => setOpen(now => withPart(now, title, toggledTo(event)))}>
            <input id={`measured-fold-${id}-checkbox`} className="info-toggle off-screen" type="checkbox"/>
            <label id={`measured-fold-${id}-checkbox-label`} className="info-label opening-arrow inverse-filled prior-approached corner-after" htmlFor={`measured-fold-${id}-checkbox`}>{title}</label>
            <MeasuredPanel open={open.includes(title)} namedBy={`measured-fold-${id}-checkbox-label`}>
              <p className="info-paragraph">{text}</p>
            </MeasuredPanel>
          </li>)}
      </ul>
    </fieldset>
  </article>;
};

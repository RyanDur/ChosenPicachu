import {ChangeEvent, FC, useState} from 'react';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import {MeasuredPanel} from './MeasuredPanel';
import './Accordions.css';

const toggledTo = ({target}: ChangeEvent<HTMLLIElement>): boolean =>
  target instanceof HTMLInputElement && target.checked;

const withPart = (open: readonly string[], key: string, opened: boolean): readonly string[] =>
  opened ? [...open, key] : open.filter(part => part !== key);

export const InclusiveMeasuredAccordion: FC<AccordionProps> = ({
  className,
  content,
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
        {content.map(({value, key}, id) =>
          <li key={key} className="fold"
            onChange={event => setOpen(now => withPart(now, key, toggledTo(event)))}>
            <input id={`measured-fold-${id}-checkbox`} className="info-toggle off-screen" type="checkbox"/>
            <label id={`measured-fold-${id}-checkbox-label`} className="info-label opening-arrow inverse-filled prior-approached corner-after" htmlFor={`measured-fold-${id}-checkbox`}>{key}</label>
            <MeasuredPanel open={open.includes(key)} namedBy={`measured-fold-${id}-checkbox-label`}>
              <p className="info-paragraph">{value}</p>
            </MeasuredPanel>
          </li>)}
      </ul>
    </fieldset>
  </article>;
};

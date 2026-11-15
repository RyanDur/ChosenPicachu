import {ChangeEvent, FC, useReducer} from 'react';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import {MeasuredPanel} from './MeasuredPanel';
import {Closed, foldChange, Opened} from './fold-change';
import {openFolds} from './open-folds';
import {OpenFolds} from './OpenFolds';
import './Accordions.css';
import './OldWayMotion.css';

const toggled = ({target}: ChangeEvent<HTMLLIElement>, fold: string): Opened | Closed =>
  target instanceof HTMLInputElement && target.checked ? foldChange.opened(fold) : foldChange.closed(fold);

const barOf = (id: number): string => `measured-fold-${id}-checkbox-label`;

export const InclusiveMeasuredAccordion: FC<AccordionProps> = ({
  className,
  folds
}) => {
  const [open, dispatch] = useReducer(openFolds.together, []);
  return <OpenFolds.Provider value={open}>
    <article className={classNames('inclusive-accordion', className)}>
      <hgroup>
        <h3 className="sub-title bold">Accordion using checkboxes and a measured height</h3>
        <p>A few lines of script measure each fold’s height.</p>
      </hgroup>
      <fieldset>
        <legend className="off-screen">folds</legend>
        <ul className="accordion trim">
          {folds.map(({title, text}, id) =>
            <li key={title} className="fold"
              onChange={event => dispatch(toggled(event, barOf(id)))}>
              <input id={`measured-fold-${id}-checkbox`} className="info-toggle off-screen" type="checkbox"/>
              <label id={barOf(id)} className="info-label opening-arrow inverse-filled prior-approached corner-after" htmlFor={`measured-fold-${id}-checkbox`}>{title}</label>
              <MeasuredPanel namedBy={barOf(id)}>
                <p className="info-paragraph">{text}</p>
              </MeasuredPanel>
            </li>)}
        </ul>
      </fieldset>
    </article>
  </OpenFolds.Provider>;
};

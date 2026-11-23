import {ChangeEvent, FC, useReducer} from 'react';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import {MeasuredPanel} from './MeasuredPanel';
import {Closed, foldChange, Opened} from './fold-change';
import {openFolds} from './open-folds';
import {OpenFolds} from './OpenFolds';
import './Accordions.css';
import './OldWayMotion.css';

const toggled = ({target}: ChangeEvent<HTMLLIElement>, bar: string): Opened | Closed =>
  target instanceof HTMLInputElement && target.checked ? foldChange.opened(bar) : foldChange.closed(bar);

const barOf = (id: number): string => `measured-fold-${id}-checkbox-label`;

export const InclusiveMeasuredAccordion: FC<AccordionProps> = ({
  className,
  folds
}) => {
  const [open, dispatch] = useReducer(openFolds.together, []);
  return <OpenFolds.Provider value={open}>
    <article className={classNames('inclusive-accordion', className)}>
      <fieldset>
        <legend className="off-screen">folds</legend>
        <ul className="accordion">
          {folds.map(({heading, story}, id) =>
            <li key={heading} className="fold"
              onChange={event => dispatch(toggled(event, barOf(id)))}>
              <input id={`measured-fold-${id}-checkbox`} className="info-toggle off-screen" type="checkbox"/>
              <label id={barOf(id)} className="info-label opening-arrow drawn-piece prior-approached corner-after"
                htmlFor={`measured-fold-${id}-checkbox`}>{heading}</label>
              <MeasuredPanel namedBy={barOf(id)}>
                <p className="info-paragraph drawn-piece">{story}</p>
              </MeasuredPanel>
            </li>)}
        </ul>
      </fieldset>
    </article>
  </OpenFolds.Provider>;
};

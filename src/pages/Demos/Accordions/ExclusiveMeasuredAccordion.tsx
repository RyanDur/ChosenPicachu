import {FC, useReducer} from 'react';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import {MeasuredPanel} from './MeasuredPanel';
import {foldChange} from './fold-change';
import {openFolds} from './open-folds';
import {OpenFolds} from './OpenFolds';
import './Accordions.css';
import './OldWayMotion.css';

const barOf = (id: number): string => `measured-fold-${id}-radio-label`;

export const ExclusiveMeasuredAccordion: FC<AccordionProps> = ({
  className,
  folds
}) => {
  const [open, dispatch] = useReducer(openFolds.oneAtATime, []);
  return <OpenFolds.Provider value={open}>
    <article className={classNames('exclusive-accordion', className)}>
      <fieldset>
        <legend className="off-screen">folds</legend>
        <ul className="accordion">
          <li className="fold close drawn-piece" onChange={() => dispatch(foldChange.allClosed())}>
            <input id="measured-close-radio" defaultChecked={true} className="info-toggle off-screen" type="radio"
              name="measured-group"/>
            <label className="info-label prior-approached" htmlFor="measured-close-radio">Close</label>
          </li>
          {folds.map(({heading, story}, id) =>
            <li className="fold" key={heading} onChange={() => dispatch(foldChange.opened(barOf(id)))}>
              <input id={`measured-fold-${id}-radio`} className="info-toggle off-screen" type="radio"
                name="measured-group"/>
              <label id={barOf(id)} className="info-label opening-arrow drawn-piece prior-approached corner-after"
                htmlFor={`measured-fold-${id}-radio`}>{heading}</label>
              <MeasuredPanel namedBy={barOf(id)}>
                <p className="info-paragraph drawn-piece">{story}</p>
              </MeasuredPanel>
            </li>)}
        </ul>
      </fieldset>
    </article>
  </OpenFolds.Provider>;
};

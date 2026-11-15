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
      <hgroup>
        <h3 className="sub-title bold">Accordion using a radio group and a measured height</h3>
        <p>A few lines of script measure each fold’s height.</p>
      </hgroup>
      <fieldset>
        <legend className="off-screen">folds</legend>
        <ul className="accordion trim">
          <li className="fold close field-inverse" onChange={() => dispatch(foldChange.allClosed())}>
            <input id="measured-close-radio" defaultChecked={true} className="info-toggle off-screen" type="radio" name="measured-group"/>
            <label className="info-label field-ink prior-approached" htmlFor="measured-close-radio">Close</label>
          </li>
          {folds.map(({title, text}, id) =>
            <li className="fold" key={title} onChange={() => dispatch(foldChange.opened(barOf(id)))}>
              <input id={`measured-fold-${id}-radio`} className="info-toggle off-screen" type="radio" name="measured-group"/>
              <label id={barOf(id)} className="info-label opening-arrow inverse-filled prior-approached corner-after" htmlFor={`measured-fold-${id}-radio`}>{title}</label>
              <MeasuredPanel namedBy={barOf(id)}>
                <p className="info-paragraph">{text}</p>
              </MeasuredPanel>
            </li>)}
        </ul>
      </fieldset>
    </article>
  </OpenFolds.Provider>;
};

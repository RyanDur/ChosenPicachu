import {FC} from 'react';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import './Accordions.css';

export const InclusiveCheckboxToggleAccordion: FC<AccordionProps> = ({
  className,
  content,
  motion
}) => <article className={classNames('toggle-accordion', motion, className)}>
  <header>
    <h3 className="sub-title bold">Inclusive accordion using checkboxes</h3>
  </header>

  <fieldset>
    <legend className="off-screen">folds</legend>
    <ul className="new-accordion">
      {content.map(({value, key}) =>
        <li key={key} className="grid-fold">
          <header className="fold-bar field-inverse field-ink field-outlined">
            <span className="sub-title bold">{key}</span>
            <label className="fold-control inverse-filled attentive hairline-outline field-pressed">
              <input type="checkbox" className="off-screen"/>
              <span className="when-closed">Open</span><span className="when-open">Close</span>
              <span className="off-screen">{key}</span>
            </label>
          </header>
          <p className="fold-clip"><span className="fold-clip-item"><span className="fold-text">{value}</span></span></p>
        </li>)}
    </ul>
  </fieldset>
</article>;

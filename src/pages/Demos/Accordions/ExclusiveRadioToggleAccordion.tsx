import {FC, KeyboardEvent, MouseEvent} from 'react';
import {Maybe, nothing, some} from '@ryandur/sand';
import {classNames} from '@components';
import {AccordionProps} from './accordion-props';
import './Accordions.css';

const openAfter = (pressed: string, open?: string): Maybe<string> => open === pressed ? nothing() : some(pressed);

const radioPressed = (list: HTMLUListElement, radio: HTMLInputElement): void =>
  openAfter(radio.value, list.dataset.open).either(
    next => {
      list.dataset.open = next;
    },
    () => {
      radio.checked = false;
      delete list.dataset.open;
    });

const radioClicked = ({currentTarget: list, target}: MouseEvent<HTMLUListElement>): void => {
  if (target instanceof HTMLInputElement) {
    radioPressed(list, target);
  }
};

const spacePressed = (event: KeyboardEvent<HTMLUListElement>): void => {
  const {currentTarget: list, target, key} = event;
  if (key === ' ' && target instanceof HTMLInputElement && target.checked) {
    event.preventDefault();
    radioPressed(list, target);
  }
};

export const ExclusiveRadioToggleAccordion: FC<AccordionProps> = ({
  className,
  content,
  motion
}) => <article className={classNames('toggle-accordion', motion, className)}>
  <header>
    <h3 className="sub-title bold">Exclusive accordion using radio group</h3>
  </header>

  <fieldset>
    <legend className="off-screen">folds</legend>
    <ul className="new-accordion" onClick={radioClicked} onKeyDown={spacePressed}>
      {content.map(({value, key}) =>
        <li key={key} className="grid-fold">
          <header className="fold-bar field-inverse field-ink field-outlined">
            <span className="sub-title bold">{key}</span>
            <label className="fold-control inverse-filled attentive hairline-outline field-pressed">
              <input type="radio" name="exclusive-radio-toggle" value={key} className="off-screen"/>
              <span className="when-closed">Open</span><span className="when-open">Close</span>
              <span className="off-screen">{key}</span>
            </label>
          </header>
          <p className="fold-clip"><span className="fold-clip-item"><span className="fold-text">{value}</span></span></p>
        </li>)}
    </ul>
  </fieldset>
</article>;

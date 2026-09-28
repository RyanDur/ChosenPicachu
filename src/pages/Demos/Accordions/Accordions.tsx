import {FC, KeyboardEvent, MouseEvent, ReactNode} from 'react';
import {classNames} from '@components/class-names';
import {PillGlider} from '@components/PillGlider';
import {PropsWithClassName} from '../types';
import './Accordions.css';

const motions = [{display: 'Animate', value: 'animated'}, {display: 'Static', value: 'static'}] as const;

const pressedIn = (list: HTMLUListElement, radio: HTMLInputElement): void => {
  if (list.dataset.open === radio.value) {
    radio.checked = false;
    delete list.dataset.open;
  } else {
    list.dataset.open = radio.value;
  }
};

const aRadioClicked = ({currentTarget: list, target}: MouseEvent<HTMLUListElement>): void => {
  if (target instanceof HTMLInputElement) {
    pressedIn(list, target);
  }
};

const spaceOnTheOpenRadio = (event: KeyboardEvent<HTMLUListElement>): void => {
  const {currentTarget: list, target, key} = event;
  if (key === ' ' && target instanceof HTMLInputElement && target.checked) {
    event.preventDefault();
    pressedIn(list, target);
  }
};

export type Fold = {value: ReactNode; key: string};
type ContentProps = {content: Fold[]};
export const InclusiveAccordion: FC<PropsWithClassName & ContentProps> = ({
  className,
  content
}) => <article className={classNames('inclusive-accordion', className)}>
  <header>
    <h4 className="sub-title bold">Accordion using checkboxes</h4>
    <p>no Javascript needed to pull this off.</p>
  </header>
  <ul className="accordion">
    {content.map(({value, key}, id) =>
      <li key={key} className="fold">
        <input id={`fold-${id}-checkbox`} className="info-toggle off-screen" type="checkbox"/>
        <label className="info-label" htmlFor={`fold-${id}-checkbox`}>{key}</label>
        <p className="info">{value}</p>
      </li>)}
  </ul>
</article>;

export const ExclusiveAccordion: FC<PropsWithClassName & ContentProps> = ({
  className,
  content
}) => <article className={classNames('exclusive-accordion', className)}>
  <header>
    <h4 className="sub-title bold">Accordion using a radio group</h4>
    <p>no Javascript needed to pull this off.</p>
  </header>
  <ul className="accordion">
    <li className="fold close">
      <input id="close-radio" defaultChecked={true} className="info-toggle off-screen" type="radio" name="group"/>
      <label className="info-label" htmlFor="close-radio">Close</label>
    </li>
    {content.map(({value, key}, id) =>
      <li className="fold" key={key}>
        <input id={`fold-${id}-radio`} className="info-toggle off-screen" type="radio" name="group"/>
        <label className="info-label" htmlFor={`fold-${id}-radio`}>{key}</label>
        <p className="info">{value}</p>
      </li>)}
  </ul>
</article>;

export const InclusiveToggleAccordion: FC<PropsWithClassName & ContentProps> = ({
  className,
  content
}) => <article className={classNames('inclusive-toggle-accordion', className)}>
  <header>
    <h4 className="sub-title bold">Inclusive accordion using details elements</h4>
  </header>
  <ul className="new-accordion">
    {content.map(({value, key}) =>
      <li key={key}>
        <details className="fold">
          <summary className="info-label">{key}</summary>
          <p className="info">{value}</p>
        </details>
      </li>)}
  </ul>
</article>;

export const ExclusiveToggleAccordion: FC<PropsWithClassName & ContentProps> = ({
  className,
  content
}) => <article className={classNames('exclusive-toggle-accordion', className)}>
  <header>
    <h4 className="sub-title bold">Exclusive accordion using details elements</h4>
  </header>
  <ul className="new-accordion">
    {content.map(({value, key}) =>
      <li key={key}>
        <details className="fold" name="exclusive-toggle-accordion">
          <summary className="info-label">{key}</summary>
          <p className="info">{value}</p>
        </details>
      </li>)}
  </ul>
</article>;

export const InclusiveCheckboxToggleAccordion: FC<PropsWithClassName & ContentProps> = ({
  className,
  content
}) => <article className={classNames('inclusive-checkbox-toggle-accordion', 'toggle-accordion', className)}>
  <header className="build-header">
    <h4 className="sub-title bold">Inclusive accordion using checkboxes</h4>
    <PillGlider label="animation style" name="inclusive-checkbox-motion" options={motions} defaultChosen="animated"/>
  </header>

  <ul className="new-accordion">
    {content.map(({value, key}) =>
      <li key={key}>
        <article className="grid-fold reveal">
          <header className="info-header">
            <h5 className="sub-title bold">{key}</h5>
            <label className="info-label">
              <span className="open-word">Open</span>
              <span className="close-word">Close</span>
              <span className="off-screen"> {key}</span>
              <input type="checkbox" className="off-screen"/>
            </label>
          </header>

          <p className="fold-clip"><span className="fold-clip-item"><span className="fold-text">{value}</span></span></p>
        </article>
      </li>)}
  </ul>
</article>;

export const ExclusiveRadioToggleAccordion: FC<PropsWithClassName & ContentProps> = ({
  className,
  content
}) => <article className={classNames('exclusive-radio-toggle-accordion', 'toggle-accordion', className)}>
  <header className="build-header">
    <h4 className="sub-title bold">Exclusive accordion using radio group</h4>
    <PillGlider label="animation style" name="exclusive-radio-motion" options={motions} defaultChosen="animated"/>
  </header>

  <ul className="new-accordion" onClick={aRadioClicked} onKeyDown={spaceOnTheOpenRadio}>
    {content.map(({value, key}) =>
      <li key={key}>
        <article className="grid-fold drawer">
          <header className="info-header">
            <h5 className="sub-title bold">{key}</h5>
            <label className="info-label">
              <span className="open-word">Open</span>
              <span className="close-word">Close</span>
              <span className="off-screen"> {key}</span>
              <input type="radio" name="exclusive-radio-toggle" value={key} className="off-screen"/>
            </label>
          </header>

          <p className="fold-clip"><span className="fold-clip-item"><span className="fold-text">{value}</span></span></p>
        </article>
      </li>)}
  </ul>
</article>;

import {FC, KeyboardEvent, MouseEvent, ReactNode} from 'react';
import {maybe} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {PropsWithClassName} from '../types';
import {FoldMotion} from './fold-motion';
import './Accordions.css';

const openAfter = (pressed: string, open?: string) => open === pressed ? undefined : pressed;

const radioPressed = (list: HTMLUListElement, radio: HTMLInputElement): void =>
  maybe(openAfter(radio.value, list.dataset.open)).either(
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

export const InclusiveCheckboxToggleAccordion: FC<PropsWithClassName & ContentProps & {motion: FoldMotion}> = ({
  className,
  content,
  motion
}) => <article className={classNames('inclusive-checkbox-toggle-accordion', 'toggle-accordion', motion, className)}>
  <header className="build-header">
    <h4 className="sub-title bold">Inclusive accordion using checkboxes</h4>
  </header>

  <fieldset>
    <legend className="off-screen">parts</legend>
    <ul className="new-accordion">
      {content.map(({value, key}) =>
        <li key={key}>
          <article className="grid-fold">
            <header className="info-header">
              <h5 className="sub-title bold">{key}</h5>
              <label className="info-label">
                <span className="off-screen">{key}</span>
                <input type="checkbox" className="off-screen"/>
              </label>
            </header>

            <p className="fold-clip"><span className="fold-clip-item"><span className="fold-text">{value}</span></span></p>
          </article>
        </li>)}
    </ul>
  </fieldset>
</article>;

export const ExclusiveRadioToggleAccordion: FC<PropsWithClassName & ContentProps & {motion: FoldMotion}> = ({
  className,
  content,
  motion
}) => <article className={classNames('exclusive-radio-toggle-accordion', 'toggle-accordion', motion, className)}>
  <header className="build-header">
    <h4 className="sub-title bold">Exclusive accordion using radio group</h4>
  </header>

  <fieldset>
    <legend className="off-screen">parts</legend>
    <ul className="new-accordion" onClick={radioClicked} onKeyDown={spacePressed}>
      {content.map(({value, key}) =>
        <li key={key}>
          <article className="grid-fold">
            <header className="info-header">
              <h5 className="sub-title bold">{key}</h5>
              <label className="info-label">
                <span className="off-screen">{key}</span>
                <input type="radio" name="exclusive-radio-toggle" value={key} className="off-screen"/>
              </label>
            </header>

            <p className="fold-clip"><span className="fold-clip-item"><span className="fold-text">{value}</span></span></p>
          </article>
        </li>)}
    </ul>
  </fieldset>
</article>;

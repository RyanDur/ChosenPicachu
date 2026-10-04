import {FC, KeyboardEvent, MouseEvent, ReactNode} from 'react';
import {Maybe, nothing, some} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {PropsWithClassName} from '../types';
import {FoldMotion} from './fold-motion';
import {foldMeasured} from './measured';
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

export type Fold = {value: ReactNode; key: string};
type ContentProps = {content: Fold[]};
export const InclusiveAccordion: FC<PropsWithClassName & ContentProps & {motion: FoldMotion}> = ({
  className,
  content,
  motion
}) => <article className={classNames('inclusive-accordion', motion, className)}>
  <hgroup>
    <h4 className="sub-title bold">Accordion using checkboxes and a known height</h4>
    <p>no Javascript needed to pull this off.</p>
  </hgroup>
  <fieldset>
    <legend className="off-screen">parts</legend>
    <ul className="accordion">
      {content.map(({value, key}, id) =>
        <li key={key} className="fold">
          <input id={`fold-${id}-checkbox`} className="info-toggle off-screen" type="checkbox"/>
          <label id={`fold-${id}-checkbox-label`} className="info-label opening-arrow" htmlFor={`fold-${id}-checkbox`}>{key}</label>
          <div className="info">
            <section className="info-text" tabIndex={0} aria-labelledby={`fold-${id}-checkbox-label`}>
              <p className="info-paragraph">{value}</p>
            </section>
          </div>
        </li>)}
    </ul>
  </fieldset>
</article>;

export const ExclusiveAccordion: FC<PropsWithClassName & ContentProps & {motion: FoldMotion}> = ({
  className,
  content,
  motion
}) => <article className={classNames('exclusive-accordion', motion, className)}>
  <hgroup>
    <h4 className="sub-title bold">Accordion using a radio group and a known height</h4>
    <p>no Javascript needed to pull this off.</p>
  </hgroup>
  <fieldset>
    <legend className="off-screen">parts</legend>
    <ul className="accordion">
      <li className="fold close">
        <input id="close-radio" defaultChecked={true} className="info-toggle off-screen" type="radio" name="group"/>
        <label className="info-label" htmlFor="close-radio">Close</label>
      </li>
      {content.map(({value, key}, id) =>
        <li className="fold" key={key}>
          <input id={`fold-${id}-radio`} className="info-toggle off-screen" type="radio" name="group"/>
          <label id={`fold-${id}-radio-label`} className="info-label opening-arrow" htmlFor={`fold-${id}-radio`}>{key}</label>
          <div className="info">
            <section className="info-text" tabIndex={0} aria-labelledby={`fold-${id}-radio-label`}>
              <p className="info-paragraph">{value}</p>
            </section>
          </div>
        </li>)}
    </ul>
  </fieldset>
</article>;

export const InclusiveToggleAccordion: FC<PropsWithClassName & ContentProps & {motion: FoldMotion}> = ({
  className,
  content,
  motion
}) => <article className={classNames('inclusive-toggle-accordion', motion, className)}>
  <header>
    <h4 className="sub-title bold">Inclusive accordion using details elements</h4>
  </header>
  <ul className="new-accordion">
    {content.map(({value, key}) =>
      <li key={key}>
        <details className="fold">
          <summary className="info-label opening-arrow">{key}</summary>
          <p className="info">{value}</p>
        </details>
      </li>)}
  </ul>
</article>;

export const ExclusiveToggleAccordion: FC<PropsWithClassName & ContentProps & {motion: FoldMotion}> = ({
  className,
  content,
  motion
}) => <article className={classNames('exclusive-toggle-accordion', motion, className)}>
  <header>
    <h4 className="sub-title bold">Exclusive accordion using details elements</h4>
  </header>
  <ul className="new-accordion">
    {content.map(({value, key}) =>
      <li key={key}>
        <details className="fold" name="exclusive-toggle-accordion">
          <summary className="info-label opening-arrow">{key}</summary>
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
  <header>
    <h4 className="sub-title bold">Inclusive accordion using checkboxes</h4>
  </header>

  <fieldset>
    <legend className="off-screen">parts</legend>
    <ul className="new-accordion">
      {content.map(({value, key}) =>
        <li key={key} className="grid-fold">
          <label className="info-label">
            <span className="sub-title bold">{key}</span>
            <input type="checkbox" className="off-screen"/>
          </label>
          <p className="fold-clip"><span className="fold-clip-item"><span className="fold-text">{value}</span></span></p>
        </li>)}
    </ul>
  </fieldset>
</article>;

export const ExclusiveRadioToggleAccordion: FC<PropsWithClassName & ContentProps & {motion: FoldMotion}> = ({
  className,
  content,
  motion
}) => <article className={classNames('exclusive-radio-toggle-accordion', 'toggle-accordion', motion, className)}>
  <header>
    <h4 className="sub-title bold">Exclusive accordion using radio group</h4>
  </header>

  <fieldset>
    <legend className="off-screen">parts</legend>
    <ul className="new-accordion" onClick={radioClicked} onKeyDown={spacePressed}>
      {content.map(({value, key}) =>
        <li key={key} className="grid-fold">
          <label className="info-label">
            <span className="sub-title bold">{key}</span>
            <input type="radio" name="exclusive-radio-toggle" value={key} className="off-screen"/>
          </label>
          <p className="fold-clip"><span className="fold-clip-item"><span className="fold-text">{value}</span></span></p>
        </li>)}
    </ul>
  </fieldset>
</article>;

export const InclusiveMeasuredAccordion: FC<PropsWithClassName & ContentProps & {motion: FoldMotion}> = ({
  className,
  content,
  motion
}) => <article className={classNames('inclusive-accordion', motion, className)}>
  <hgroup>
    <h4 className="sub-title bold">Accordion using checkboxes and a measured height</h4>
    <p>a few lines of script measure each part’s height.</p>
  </hgroup>
  <fieldset>
    <legend className="off-screen">parts</legend>
    <ul className="accordion" onChange={foldMeasured}>
      {content.map(({value, key}, id) =>
        <li key={key} className="fold">
          <input id={`measured-fold-${id}-checkbox`} className="info-toggle off-screen" type="checkbox"/>
          <label className="info-label" htmlFor={`measured-fold-${id}-checkbox`}>{key}</label>
          <div className="info-measured">
            <p className="info-paragraph">{value}</p>
          </div>
        </li>)}
    </ul>
  </fieldset>
</article>;

export const ExclusiveMeasuredAccordion: FC<PropsWithClassName & ContentProps & {motion: FoldMotion}> = ({
  className,
  content,
  motion
}) => <article className={classNames('exclusive-accordion', motion, className)}>
  <hgroup>
    <h4 className="sub-title bold">Accordion using a radio group and a measured height</h4>
    <p>a few lines of script measure each part’s height.</p>
  </hgroup>
  <fieldset>
    <legend className="off-screen">parts</legend>
    <ul className="accordion" onChange={foldMeasured}>
      <li className="fold close">
        <input id="measured-close-radio" defaultChecked={true} className="info-toggle off-screen" type="radio" name="measured-group"/>
        <label className="info-label" htmlFor="measured-close-radio">Close</label>
      </li>
      {content.map(({value, key}, id) =>
        <li className="fold" key={key}>
          <input id={`measured-fold-${id}-radio`} className="info-toggle off-screen" type="radio" name="measured-group"/>
          <label className="info-label" htmlFor={`measured-fold-${id}-radio`}>{key}</label>
          <div className="info-measured">
            <p className="info-paragraph">{value}</p>
          </div>
        </li>)}
    </ul>
  </fieldset>
</article>;

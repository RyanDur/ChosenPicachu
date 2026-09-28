import {FC, ReactNode, useState} from 'react';
import {classNames} from '@components/class-names';
import {PillGlider} from '@components/PillGlider';
import {PropsWithClassName} from '../types';
import './Accordions.css';

const toggleWord = (open: boolean) => open ? 'Close' : 'Open';

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

export const ExclusiveCheckboxToggleAccordion: FC<PropsWithClassName & ContentProps> = ({
  className,
  content
}) => {
  const [checked, updateChecked] = useState<string>();
  const [tab, updateTab] = useState<'animated' | 'static'>('animated');

  return <article className={classNames('exclusive-checkbox-toggle-accordion', 'toggle-accordion', className)}>
    <header className="react-header">
      <h4 className="sub-title bold">Exclusive accordion using checkboxes</h4>
      <PillGlider label="animation style"
        name="checkbox-animate-or-static-tab"
        options={[{display: 'Animate', value: 'animated'}, {display: 'Static', value: 'static'}]}
        chosen={tab}
        onChosen={updateTab}/>
    </header>

    <ul className={'new-accordion'}>
      {content.map(({value, key}) =>
        <li key={key}>
          <article className={classNames('react-fold', tab, 'reveal')}>
            <header className="info-header">
              <h5 className="sub-title bold">{key}</h5>
              <label className="info-label">
                {toggleWord(key === checked)}
                <input
                  type="checkbox"
                  aria-label={`${toggleWord(key === checked)} ${key}`}
                  checked={key === checked}
                  onChange={() => updateChecked(open => open === key ? undefined : key)}
                  className="off-screen"/>
              </label>
            </header>

            <p className="fold-clip"><span className="fold-clip-item"><span className="fold-text">{value}</span></span></p>
          </article>
        </li>)}
    </ul>
  </article>;
};

export const ExclusiveRadioToggleAccordion: FC<PropsWithClassName & ContentProps> = ({
  className,
  content
}) => {
  const [checked, updateChecked] = useState<string>();
  const [tab, updateTab] = useState<'animated' | 'static'>('animated');
  return <article className={classNames('exclusive-radio-toggle-accordion', 'toggle-accordion', className)}>
    <header className="react-header">
      <h4 className="sub-title bold">Exclusive accordion using radio group</h4>
      <PillGlider label="animation style"
        name="radio-animate-or-static-tab"
        options={[{display: 'Animate', value: 'animated'}, {display: 'Static', value: 'static'}]}
        chosen={tab}
        onChosen={updateTab}/>
    </header>

    <ul className={'new-accordion'}>
      {content.map(({value, key}) =>
        <li key={key}>
          <article className={classNames('react-fold', tab === 'animated' && 'animated drawer')}>
            <header className="info-header">
              <h5 className="sub-title bold">{key}</h5>
              <label className="info-label">
                {toggleWord(key === checked)}
                <input
                  type="radio"
                  name="exclusive-checkbox-toggle"
                  aria-label={`${toggleWord(key === checked)} ${key}`}
                  checked={key === checked}
                  value={key}
                  onChange={event => updateChecked(event.currentTarget.value)}
                  onClick={() => checked === key && updateChecked(undefined)}
                  className="off-screen"/>
              </label>
            </header>

            <p className="fold-clip"><span className="fold-clip-item"><span className="fold-text">{value}</span></span></p>
          </article>
        </li>)}
    </ul>
  </article>;
};

export const InclusiveCheckboxToggleAccordion: FC<PropsWithClassName & ContentProps> = ({
  className,
  content
}) => {
  const [opened, updateOpened] = useState<readonly string[]>([]);
  const [tab, updateTab] = useState<'animated' | 'static'>('animated');
  const isOpen = (key: string) => opened.includes(key);

  return <article className={classNames('inclusive-checkbox-toggle-accordion', 'toggle-accordion', className)}>
    <header className="react-header">
      <h4 className="sub-title bold">Inclusive accordion using checkboxes</h4>
      <PillGlider label="animation style"
        name="inclusive-checkbox-animate-or-static-tab"
        options={[{display: 'Animate', value: 'animated'}, {display: 'Static', value: 'static'}]}
        chosen={tab}
        onChosen={updateTab}/>
    </header>

    <ul className={'new-accordion'}>
      {content.map(({value, key}) =>
        <li key={key}>
          <article className={classNames('react-fold', tab, 'reveal')}>
            <header className="info-header">
              <h5 className="sub-title bold">{key}</h5>
              <label className="info-label">
                {toggleWord(isOpen(key))}
                <input
                  type="checkbox"
                  aria-label={`${toggleWord(isOpen(key))} ${key}`}
                  checked={isOpen(key)}
                  onChange={() => updateOpened(open => open.includes(key) ? open.filter(part => part !== key) : [...open, key])}
                  className="off-screen"/>
              </label>
            </header>

            <p className="fold-clip"><span className="fold-clip-item"><span className="fold-text">{value}</span></span></p>
          </article>
        </li>)}
    </ul>
  </article>;
};

import {FC, ReactNode, useState} from 'react';
import {classNames} from '@components/class-names';
import {PillGlider} from '@components/PillGlider';
import {PropsWithClassName} from '../types';
import './styles.css';

type ContentProps = { content: { value: ReactNode, key: string }[] };
export const InclusiveAccordion: FC<PropsWithClassName & ContentProps> = ({
  className,
  content
}) => <article className={className}>
  <header>
    <h2 className="title bold">Accordion using checkboxes</h2>
    <p>no Javascript needed to pull this off.</p>
  </header>
  <ul className='accordion'>
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
}) => <article className={className}>
  <header>
    <h2 className="title bold">Accordion using a radio group</h2>
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

export const ExclusiveToggleAccordion: FC<PropsWithClassName & ContentProps> = ({
  className,
  content
}) => <article className={className}>
  <header className="exclusive-checkbox-header">
    <h2 className="title bold">Exclusive accordion using details elements</h2>
  </header>
  <ul className='new-accordion'>
    {content.map(({value, key}) =>
      <li key={key}>
        <details className="fold" name="exclusive-toggle-accordian">
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
    <header className="exclusive-checkbox-header">
      <h2 className="title bold">Exclusive accordion using checkboxes</h2>
      <PillGlider label="animation style"
                  name="checkbox-animate-or-static-tab"
                  options={[{display: 'Animate', value: 'animated'}, {display: 'Static', value: 'static'}]}
                  chosen={tab}
                  onChoose={value => {
                    updateChecked(undefined);
                    updateTab(value);
                  }}/>
    </header>

    <ul className={'new-accordion'}>
      {content.map(({value, key}) =>
        <li key={key}>
          <article className={classNames('exclusive-fold', tab, 'reveal')}>
            <header className="info-header">
              <h3 className="sub-title bold">{key}</h3>
              <label className="info-label">
                {key === checked ? 'Close' : 'Open'}
                <input
                  type="checkbox"
                  name='exclusive-fold'
                  checked={key === checked}
                  onClick={() => checked === key && updateChecked(undefined)}
                  onChange={() => checked !== key && updateChecked(key)}
                  className="off-screen"/>
              </label>
            </header>


            <article className="info-animated">
              <article className="info-animated-wrapper">
                <article className="info">{value}</article>
              </article>
            </article>
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
    <header className="exclusive-checkbox-header">
      <h2 className="title bold">Exclusive accordion using radio group</h2>
      <article className='pill-tabs'>
        <label className='pill-tab'>
          Animate
          <input type="radio"
                 className='off-screen'
                 name="radio-animate-or-static-tab"
                 checked={tab === 'animated'}
                 value='animated'
                 onChange={(event) => updateChecked(event.currentTarget.value)}
                 onClick={() => updateTab('animated')}/>
        </label>

        <label className='pill-tab'>
          Static
          <input type="radio"
                 className='off-screen'
                 name="radio-animate-or-static-tab"
                 checked={tab === 'static'}
                 value='static'
                 onChange={(event) => updateChecked(event.currentTarget.value)}
                 onClick={() => updateTab('static')}/>
        </label>
      </article>
    </header>

    <ul className={'new-accordion'}>
      {content.map(({value, key}) =>
        <li key={key}>
          <article className={classNames('exclusive-fold', tab === 'animated' && 'animated drawer')}>
            <header className="info-header">
              <h3 className="sub-title bold">{key}</h3>
              <label className="info-label">
                {key === checked ? 'Close' : 'Open'}
                <input
                  type="radio"
                  name="exclusive-checkbox-toggle"
                  checked={key === checked}
                  value={key}
                  onChange={(event) => updateChecked(event.currentTarget.value)}
                  onClick={() => checked === key && updateChecked(undefined)}
                  className="off-screen"/>
              </label>
            </header>

            <article className="info-animated-wrapper">
              <article className="info-animated">
                <article className="info-transform-wrapper">
                  <article className="info">{value}</article>
                </article>
              </article>
            </article>
          </article>
        </li>)}
    </ul>
  </article>;
};

import {faker} from '@faker-js/faker';
import {FC, ReactNode, useState} from 'react';
import {classNames} from '../../../util/classNames';
import {PropsWithClassName} from '../../_types';
import './styles.css';

type ContentProps = { content: { value: ReactNode, key: string }[] };
export const InclusiveAccordion: FC<PropsWithClassName & ContentProps> = ({
  className,
  content
}) =>
  <ul className={classNames('accordion', className)}>
    {content.map(({value, key}, id) =>
      <li key={key} className="fold">
        <input id={`${id}-checkbox`} className="info-toggle off-screen" type="checkbox"/>
        <label className="info-label" htmlFor={`${id}-checkbox`}>{faker.lorem.word()}</label>
        <p className="info">{value}</p>
      </li>)}
  </ul>;

export const ExclusiveAccordion: FC<PropsWithClassName & ContentProps> = ({
  className,
  content
}) =>
  <ul className={classNames('accordion', className)}>
    <li className="close fold">
      <input id="close-radio" defaultChecked={true} className="info-toggle off-screen" type="radio" name="group"/>
      <label className="info-label center" htmlFor="close-radio">Close</label>
    </li>
    {content.map(({value, key}, id) =>
      <li className="fold" key={key}>
        <input id={`${id}-radio`} className="info-toggle off-screen" type="radio" name="group"/>
        <label className="info-label" htmlFor={`${id}-radio`}>{faker.lorem.word()}</label>
        <p className="info">{value}</p>
      </li>)}
  </ul>;

export const ExclusiveToggleAccordion: FC<PropsWithClassName & ContentProps> = ({
  className,
  content
}) =>
  <ul className={classNames('new-accordion', className)}>
    {content.map(({value, key}) =>
      <li key={key}>
        <details className="fold" name="exclusive-toggle-accordian">
          <summary className="info-label">{faker.lorem.word()}</summary>
          <p className="info">{value}</p>
        </details>
      </li>)}
  </ul>;

export const ExclusiveCheckboxToggleAccordion: FC<PropsWithClassName & ContentProps> = ({
  className,
  content
}) => {
  const [checked, updateChecked] = useState<string>();
  const [tab, updateTab] = useState<'animated' | 'static'>('animated');
  return <article className={classNames('exclusive-checkbox-toggle-accordion', className)}>

    <article className='pill-tabs'>
      <label className='pill-tab'>
        Animate
        <input type="radio"
               className='off-screen'
               name="animate-or-static"
               checked={tab === 'animated'}
               onClick={() => updateTab('animated')}/>
      </label>

      <label className='pill-tab'>
        Static
        <input type="radio"
               className='off-screen'
               name="animate-or-static"
               checked={tab === 'static'}
               onClick={() => {
          updateTab('static');
        }}/>
      </label>
    </article>

    <ul className={'new-accordion'}>
      {content.map(({value, key}) =>
        <li key={key}>
          <article className={classNames('exclusive-fold', tab === 'animated' && 'animated')}>
            <header className="info-header">
              <h4 className="heading">{key}</h4>
              <label className="info-label">
                {key === checked ? 'Close' : 'Open'}
                <input
                  type="checkbox"
                  checked={key === checked}
                  onClick={() => checked === key && updateChecked(undefined)}
                  onChange={() => checked !== key && updateChecked(key)}
                  className="off-screen"/>
              </label>
            </header>

            <article className="info-animated">
              <article className="info">{value}</article>
            </article>
          </article>
        </li>)}
    </ul>
  </article>;
};

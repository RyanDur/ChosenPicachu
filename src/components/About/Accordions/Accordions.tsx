import {FC, ReactNode} from 'react';
import {faker} from '@faker-js/faker';
import {PropsWithClassName} from '../../_types';
import {classNames} from '../../../util/classNames';
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

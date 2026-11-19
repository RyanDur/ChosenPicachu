import {FC} from 'react';
import {DemoLink} from '@pages/Demos/DemoLink';
import './PartsNav.css';

type Props = {to: string; heading?: string; title: string; minutes: number; says: string};

export const PartsNavEntry: FC<Props> = ({to, heading, title, minutes, says}) =>
  <li className="parts-index-entry muted-rule-below">
    <DemoLink className="parts-index-link" to={to} heading={heading}>{title}</DemoLink>
    <time className="minutes caption muted-ink" dateTime={`PT${minutes}M`}>{`${minutes} min`}</time>
    <p className="says paragraph">{says}</p>
  </li>;

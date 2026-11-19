import {FC} from 'react';
import {DemoLink} from '@pages/Demos/DemoLink';
import './PartsNavigation.css';

type Props = {to: string; heading?: string; name: string; minutes: number; says: string};

export const PartsNavigationEntry: FC<Props> = ({to, heading, name, minutes, says}) =>
  <li className="parts-index-entry muted-rule-below">
    <DemoLink className="parts-index-link" to={to} heading={heading}>{name}</DemoLink>
    <time className="minutes caption muted-ink" dateTime={`PT${minutes}M`}>{`${minutes} min`}</time>
    <p className="says paragraph">{says}</p>
  </li>;

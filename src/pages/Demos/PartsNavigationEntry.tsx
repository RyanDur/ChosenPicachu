import {FC} from 'react';
import {useLocation} from 'react-router';
import {not} from '@ryandur/sand';
import {DemoLink} from '@pages/Demos/DemoLink';
import './PartsNavigation.css';

type Props = {to: string; heading?: string; name: string; minutes: number; says: string};

export const PartsNavigationEntry: FC<Props> = ({to, heading, name, minutes, says}) => {
  const onItsPage = useLocation().pathname === to && not(heading);
  return <li className="parts-index-entry muted-rule-below">
    <DemoLink className="parts-index-link" to={to} heading={heading} current={onItsPage}>{name}</DemoLink>
    <time className="minutes caption muted-ink" dateTime={`PT${minutes}M`}>{`${minutes} min`}</time>
    <p className="says paragraph">{says}</p>
  </li>;
};

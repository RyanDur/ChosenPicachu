import {FC, PropsWithChildren} from 'react';
import {DemoLink} from '@pages/Demos/DemoLink';
import './PartsNavigation.css';

type Props = PropsWithChildren<{to: string; heading?: string; name: string}>;

export const PartsNavigationEntry: FC<Props> = ({to, heading, name, children}) =>
  <li className="parts-index-entry muted-rule-below">
    <DemoLink className="parts-index-link" to={to} heading={heading}>{name}</DemoLink>
    {children}
  </li>;

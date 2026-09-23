import {FC, useState} from 'react';
import {not as toggle} from '@ryandur/sand';
import {PropsWithClassName} from '../types';
import {classNames} from '@components/class-names';
import './ZIndexDemo.css';

export const NaturalZIndex: FC<PropsWithClassName> = ({className}) => {
  const [isCollapsed, updateCollapsed] = useState(true);
  const onClick = () => updateCollapsed(toggle(isCollapsed));

  return <section id="z-index-demo" aria-label="stacking with z-index" className={className}>
    <button className="button primary" aria-expanded={!isCollapsed} aria-controls="z-index-layers"
      onClick={onClick}>{isCollapsed ? 'Expand' : 'Collapse'}</button>
    <ol id="z-index-layers" className="demo-container">
      <li className={classNames('layer card rounded-corners floating', isCollapsed && 'closed')}>First</li>
      <li className={classNames('layer card rounded-corners floating', isCollapsed && 'closed')}>Second</li>
      <li className={classNames('layer card rounded-corners floating', isCollapsed && 'closed')}>Third</li>
    </ol>
  </section>;
};

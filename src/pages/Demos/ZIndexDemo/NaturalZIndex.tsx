import {FC, useState} from 'react';
import {not as toggle} from '@ryandur/sand';
import {PropsWithClassName} from '../types';
import {classNames} from '@components/class-names';
import './ZIndexDemo.css';

export const NaturalZIndex: FC<PropsWithClassName> = ({className}) => {
  const [isCollapsed, updateCollapsed] = useState(true);
  const onClick = () => updateCollapsed(toggle(isCollapsed));

  return <section aria-labelledby="natural-z-index-heading" className={classNames('natural-z-index', className)}>
    <h3 id="natural-z-index-heading" className="off-screen">stacking with z-index</h3>
    <button className="button primary" aria-expanded={!isCollapsed} aria-controls="z-index-layers"
      onClick={onClick}>{isCollapsed ? 'Expand' : 'Collapse'}</button>
    <ol id="z-index-layers" className="demo-container">
      <li className={classNames('layer card rounded-corners floating', isCollapsed && 'closed')}>First</li>
      <li className={classNames('layer card rounded-corners floating', isCollapsed && 'closed')}>Second</li>
      <li className={classNames('layer card rounded-corners floating', isCollapsed && 'closed')}>Third</li>
    </ol>
  </section>;
};

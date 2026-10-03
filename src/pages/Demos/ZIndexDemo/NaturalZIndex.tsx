import {FC, useState} from 'react';
import {not as toggle} from '@ryandur/sand';
import {PillGlider} from '@components/PillGlider';
import {PropsWithClassName} from '../types';
import {classNames} from '@components/class-names';
import {RaisedCard} from './raised';
import './ZIndexDemo.css';

const cardsToRaise = [
  {display: 'None', value: 'none'},
  {display: 'First', value: 'first'},
  {display: 'Second', value: 'second'},
  {display: 'Third', value: 'third'}
] as const;

type Props = PropsWithClassName & {
  raised: RaisedCard;
  onRaised: (card: RaisedCard) => void;
};

export const NaturalZIndex: FC<Props> = ({className, raised, onRaised}) => {
  const [isCollapsed, updateCollapsed] = useState(true);
  const onClick = () => updateCollapsed(toggle(isCollapsed));
  const layer = (card: RaisedCard) => classNames('layer card rounded-corners floating', isCollapsed && 'closed', raised === card && 'raised');

  return <section aria-labelledby="natural-z-index-heading" className={classNames('natural-z-index', className)}>
    <h3 id="natural-z-index-heading" className="off-screen">stacking with z-index</h3>
    <button className="button primary" aria-expanded={!isCollapsed} aria-controls="z-index-layers"
      onClick={onClick}>{isCollapsed ? 'Expand' : 'Collapse'}</button>
    <PillGlider label="card raised" name="card-raised" options={cardsToRaise} chosen={raised} onChosen={onRaised}/>
    <ol id="z-index-layers" className="demo-container">
      <li className={layer('first')}>First</li>
      <li className={layer('second')}>Second</li>
      <li className={layer('third')}>Third</li>
    </ol>
  </section>;
};

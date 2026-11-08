import {FC, useState} from 'react';
import {not as toggle} from '@ryandur/sand';
import {PillGlider} from '@components/PillGlider';
import {PropsWithClassName} from '../types';
import {classNames} from '@components';
import {useSearchParamsObject} from '@navigation/search-params';
import {RaisedCard, raisedParam} from './raised';
import './ZIndexDemo.css';

const cardsToRaise = [
  {display: 'None', value: 'none'},
  {display: 'First', value: 'first'},
  {display: 'Second', value: 'second'},
  {display: 'Third', value: 'third'}
] as const;

export const NaturalZIndex: FC<PropsWithClassName> = ({className}) => {
  const {raised, updateSearchParams} = useSearchParamsObject({raised: raisedParam}, {raised: 'none'});
  const [isCollapsed, updateCollapsed] = useState(true);
  const onClick = () => updateCollapsed(toggle(isCollapsed));
  const layer = (card: RaisedCard) => classNames('layer card rounded-corners floating', isCollapsed && 'closed', raised === card && 'raised');

  return <figure className={classNames('natural-z-index', className)}>
    <button type="button" className="button primary" aria-expanded={!isCollapsed} aria-controls="z-index-layers"
      onClick={onClick}>{isCollapsed ? 'Expand' : 'Collapse'}</button>
    <PillGlider label="card raised" name="card-raised" options={cardsToRaise} chosen={raised} onChosen={next => updateSearchParams({raised: next})}/>
    <ol id="z-index-layers" className="demo-container">
      <li className={layer('first')}>First</li>
      <li className={layer('second')}>Second</li>
      <li className={layer('third')}>Third</li>
    </ol>
    <figcaption className="caption"><strong className="bold">The pile.</strong> Raise a card over the others with the
      pills above it.</figcaption>
  </figure>;
};
